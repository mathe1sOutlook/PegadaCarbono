using CoreCO2.Data;
using CoreCO2.Materials;
using CoreCO2.Models;

namespace CoreCO2.Building.Translation;

/// <summary>
/// Implementação da tradução Building → Inventory + TransportItems + ConstructionStageInput.
/// Normaliza todos os valores por m² de área construída (unidade funcional).
/// </summary>
public class BuildingInventoryTranslator : IBuildingInventoryTranslator
{
	/// <summary>Massa por m² de compensado plastificado 17mm (0.017 m × ~530 kg/m³).</summary>
	private const decimal CompensadoKgPerM2 = 9.0m;

	/// <summary>Densidade da madeira serrada bruta (~600 kg/m³, tropical).</summary>
	private const decimal MadeiraSerradaKgPerM3 = 600m;

	/// <inheritdoc />
	public BuildingInventoryData Translate(Building building)
	{
		if (building.TotalAreaM2 <= 0)
			throw new InvalidOperationException("Área total do edifício deve ser maior que zero.");

		var totalArea = building.TotalAreaM2;
		var config = building.ConstructionConfig ?? new ConstructionConfig();
		var transport = building.TransportConfig ?? new BuildingTransportConfig();

		// 1. Agregar materiais por tipo (considerando repetições de pavimentos)
		var concreteByGrade = new Dictionary<ConcreteGrade, decimal>();
		var steelByGrade = new Dictionary<SteelGrade, decimal>();
		var formworkCompensadoM2 = 0m; // effective area (÷ reuses)
		var formworkMadeiraM3 = 0m;    // effective volume (÷ reuses)
		var totalConcreteVolumeM3 = 0m;

		foreach (var floor in building.Floors)
		{
			var reps = floor.RepetitionCount;
			foreach (var element in floor.Elements)
			{
				// Concreto por classe
				var vol = element.ConcreteVolumeM3 * reps;
				if (!concreteByGrade.TryGetValue(element.ConcreteGrade, out _))
					concreteByGrade[element.ConcreteGrade] = 0m;
				concreteByGrade[element.ConcreteGrade] += vol;
				totalConcreteVolumeM3 += vol;

				// Aço por tipo
				var steelKg = element.SteelQuantityKg * reps;
				if (!steelByGrade.TryGetValue(element.SteelGrade, out _))
					steelByGrade[element.SteelGrade] = 0m;
				steelByGrade[element.SteelGrade] += steelKg;

				// Fôrma efetiva (÷ reuses), separando por material
				var effectiveFormwork = element.EffectiveFormworkAreaM2 * reps;
				switch (element.FormworkMaterial)
				{
					case FormworkMaterial.CompensadoPlastificado:
						formworkCompensadoM2 += effectiveFormwork;
						break;
					case FormworkMaterial.MadeiraSerradaBruta:
						formworkMadeiraM3 += effectiveFormwork; // area interpreted as volume for raw wood
						break;
					case FormworkMaterial.Metalica:
						// Metálica: reutilizável centenas de vezes, emissão negligenciável
						break;
				}
			}
		}

		// 2. Inventário A1-A3 (concreto + aço, sem perdas, sem fôrma)
		var inventory = CreateProductStageInventory(
			building.Name, concreteByGrade, steelByGrade, totalArea);

		// 3. TransportItems A4 (todos os materiais até a obra, incluindo perdas)
		var transportItems = CreateTransportToSiteItems(
			concreteByGrade, steelByGrade,
			formworkCompensadoM2, formworkMadeiraM3,
			config, transport, totalArea);

		// 4. ConstructionStageInput A5 min/max
		var csMin = CreateConstructionInput(
			concreteByGrade, steelByGrade,
			formworkCompensadoM2, formworkMadeiraM3,
			totalConcreteVolumeM3, config, transport, totalArea,
			useMinFactors: true);

		var csMax = CreateConstructionInput(
			concreteByGrade, steelByGrade,
			formworkCompensadoM2, formworkMadeiraM3,
			totalConcreteVolumeM3, config, transport, totalArea,
			useMinFactors: false);

		return new BuildingInventoryData(inventory, transportItems, csMin, csMax);
	}

	/// <summary>
	/// Cria o Inventário para o estágio de produto A1-A3.
	/// Contém apenas concreto e aço (fôrmas são contabilizadas no A5).
	/// LossRatio = 0 (perdas são contabilizadas no A5).
	/// </summary>
	private static Inventory CreateProductStageInventory(
		string buildingName,
		Dictionary<ConcreteGrade, decimal> concreteByGrade,
		Dictionary<SteelGrade, decimal> steelByGrade,
		decimal totalArea)
	{
		var entries = new List<InventoryEntry>();
		var factors = new Dictionary<string, EmissionFactor>();

		// Entradas de concreto (uma por classe de resistência)
		foreach (var (grade, volume) in concreteByGrade)
		{
			var name = $"Concreto {grade}";
			var volumePerM2 = volume / totalArea;
			var density = MaterialCatalog.ConcreteDensities.TryGetValue(grade, out var d) ? d : 2400m;

			entries.Add(new InventoryEntry(
				name,
				EmissionCategory.ProcessedMaterial,
				InventoryFlowType.Input,
				volumePerM2,
				"m3",                        // DeclaredUnit m3: evita heurística factor>100
				MassConversionFactor: density // para cálculo de materialConsumption (kg/m²)
			));

			if (MaterialCatalog.ConcreteFactors.TryGetValue(grade, out var factor))
				factors[name] = factor;
		}

		// Entradas de aço (uma por tipo)
		foreach (var (grade, kg) in steelByGrade)
		{
			var name = $"Aço {grade}";
			var kgPerM2 = kg / totalArea;

			entries.Add(new InventoryEntry(
				name,
				EmissionCategory.ProcessedMaterial,
				InventoryFlowType.Input,
				kgPerM2,
				"kg"
			));

			if (MaterialCatalog.SteelFactors.TryGetValue(grade, out var factor))
				factors[name] = factor;
		}

		// Produto: 1 m² de estrutura
		entries.Add(new InventoryEntry(
			"Estrutura de concreto armado",
			EmissionCategory.ProcessedMaterial,
			InventoryFlowType.Product,
			1m,
			"m²"
		));

		return new Inventory
		{
			ProductName = buildingName,
			FunctionalUnit = "1 m² de área construída",
			Entries = entries,
			EmissionFactors = factors,
		};
	}

	/// <summary>
	/// Cria itens de transporte A4: materiais até a obra (com perdas incluídas).
	/// Concreto e aço incluem as quantidades de perda no transporte.
	/// Fôrmas (compensado e madeira) incluem o transporte de ida.
	/// </summary>
	private static List<TransportItem> CreateTransportToSiteItems(
		Dictionary<ConcreteGrade, decimal> concreteByGrade,
		Dictionary<SteelGrade, decimal> steelByGrade,
		decimal formworkCompensadoM2,
		decimal formworkMadeiraM3,
		ConstructionConfig config,
		BuildingTransportConfig transport,
		decimal totalArea)
	{
		var items = new List<TransportItem>();
		var concreteTransport = transport.EffectiveConcreteTransport;
		var steelTransport = transport.EffectiveSteelTransport;
		var formworkTransport = transport.EffectiveFormworkTransport;

		// Concreto (com perdas): massa = volume × (1 + perda%) × densidade
		foreach (var (grade, volume) in concreteByGrade)
		{
			var density = MaterialCatalog.ConcreteDensities.TryGetValue(grade, out var d) ? d : 2400m;
			var volumeWithLoss = volume * (1m + config.ConcreteLossFraction);
			var massPerM2 = volumeWithLoss * density / totalArea;

			items.Add(new TransportItem(
				$"Concreto {grade}",
				massPerM2,
				concreteTransport.DistanceKm,
				concreteTransport.Mode,
				concreteTransport.EmissionFactorPerTonKm));
		}

		// Aço (com perdas): massa = kg × (1 + perda%)
		foreach (var (grade, kg) in steelByGrade)
		{
			var kgWithLoss = kg * (1m + config.SteelLossFraction);
			var kgPerM2 = kgWithLoss / totalArea;

			items.Add(new TransportItem(
				$"Aço {grade}",
				kgPerM2,
				steelTransport.DistanceKm,
				steelTransport.Mode,
				steelTransport.EmissionFactorPerTonKm));
		}

		// Compensado plastificado: massa = área efetiva × 9 kg/m²
		if (formworkCompensadoM2 > 0)
		{
			var massPerM2 = formworkCompensadoM2 * CompensadoKgPerM2 / totalArea;
			items.Add(new TransportItem(
				"Compensado plastificado",
				massPerM2,
				formworkTransport.DistanceKm,
				formworkTransport.Mode,
				formworkTransport.EmissionFactorPerTonKm));
		}

		// Madeira serrada bruta: massa = volume × 600 kg/m³
		if (formworkMadeiraM3 > 0)
		{
			var massPerM2 = formworkMadeiraM3 * MadeiraSerradaKgPerM3 / totalArea;
			items.Add(new TransportItem(
				"Madeira serrada bruta",
				massPerM2,
				formworkTransport.DistanceKm,
				formworkTransport.Mode,
				formworkTransport.EmissionFactorPerTonKm));
		}

		return items;
	}

	/// <summary>
	/// Cria ConstructionStageInput para A5 (com fatores min ou max).
	/// Inclui: diesel, produção de materiais desperdiçados, produção de fôrmas,
	/// e geração/transporte/disposição de resíduos.
	/// </summary>
	private static ConstructionStageInput CreateConstructionInput(
		Dictionary<ConcreteGrade, decimal> concreteByGrade,
		Dictionary<SteelGrade, decimal> steelByGrade,
		decimal formworkCompensadoM2,
		decimal formworkMadeiraM3,
		decimal totalConcreteVolumeM3,
		ConstructionConfig config,
		BuildingTransportConfig transport,
		decimal totalArea,
		bool useMinFactors)
	{
		var materialLosses = new List<(string ItemName, decimal WastedQuantity, decimal A1A3Factor)>();
		var constructionWaste = new List<WasteItem>();
		var wasteTransport = transport.EffectiveWasteTransport;

		// --- Perdas de concreto (Eq. 26) ---
		foreach (var (grade, volume) in concreteByGrade)
		{
			var lossVolPerM2 = volume * config.ConcreteLossFraction / totalArea;
			if (lossVolPerM2 <= 0) continue;

			if (MaterialCatalog.ConcreteFactors.TryGetValue(grade, out var factor))
			{
				materialLosses.Add((
					$"Concreto {grade} (perda)",
					lossVolPerM2,
					useMinFactors ? factor.ValueMin : factor.ValueMax));
			}

			// Resíduo de concreto → aterro de RCD
			var density = MaterialCatalog.ConcreteDensities.TryGetValue(grade, out var d) ? d : 2400m;
			constructionWaste.Add(new WasteItem(
				$"Resíduo concreto {grade}",
				lossVolPerM2 * density,
				wasteTransport.Mode,
				wasteTransport.DistanceKm,
				config.WasteDisposalEmissionFactor));
		}

		// --- Perdas de aço (Eq. 26) ---
		foreach (var (grade, kg) in steelByGrade)
		{
			var lossKgPerM2 = kg * config.SteelLossFraction / totalArea;
			if (lossKgPerM2 <= 0) continue;

			if (MaterialCatalog.SteelFactors.TryGetValue(grade, out var factor))
			{
				materialLosses.Add((
					$"Aço {grade} (perda)",
					lossKgPerM2,
					useMinFactors ? factor.ValueMin : factor.ValueMax));
			}

			// Resíduo de aço → reciclagem (emissão de disposição = 0)
			constructionWaste.Add(new WasteItem(
				$"Resíduo aço {grade}",
				lossKgPerM2,
				wasteTransport.Mode,
				wasteTransport.DistanceKm));
		}

		// --- Produção de fôrmas (A5: consumo na obra) ---
		// Compensado plastificado: fator em kg CO₂/m², quantidade em m²/m²
		if (formworkCompensadoM2 > 0)
		{
			var areaPerM2 = formworkCompensadoM2 / totalArea;
			if (MaterialCatalog.FormworkFactors.TryGetValue(FormworkMaterial.CompensadoPlastificado, out var factor))
			{
				materialLosses.Add((
					"Compensado plastificado",
					areaPerM2,
					useMinFactors ? factor.ValueMin : factor.ValueMax));
			}

			// Resíduo de compensado → incineração/aterro
			constructionWaste.Add(new WasteItem(
				"Resíduo compensado",
				areaPerM2 * CompensadoKgPerM2,
				wasteTransport.Mode,
				wasteTransport.DistanceKm));
		}

		// Madeira serrada bruta: fator em kg CO₂/m³, quantidade em m³/m²
		if (formworkMadeiraM3 > 0)
		{
			var volumePerM2 = formworkMadeiraM3 / totalArea;
			if (MaterialCatalog.FormworkFactors.TryGetValue(FormworkMaterial.MadeiraSerradaBruta, out var factor))
			{
				materialLosses.Add((
					"Madeira serrada bruta",
					volumePerM2,
					useMinFactors ? factor.ValueMin : factor.ValueMax));
			}

			// Resíduo de madeira → incineração/aterro
			constructionWaste.Add(new WasteItem(
				"Resíduo madeira serrada",
				volumePerM2 * MadeiraSerradaKgPerM3,
				wasteTransport.Mode,
				wasteTransport.DistanceKm));
		}

		// --- Diesel para bombeamento do concreto (Eq. 24) ---
		var fuelConsumption = new List<(decimal Quantity, decimal EmissionFactor)>();
		if (config.DieselPerM3Concrete > 0 && totalConcreteVolumeM3 > 0)
		{
			var dieselPerM2 = config.DieselPerM3Concrete * totalConcreteVolumeM3 / totalArea;
			var dieselFactor = FuelEmissionFactors.All[FuelType.OleoDiesel].ValueMin;
			fuelConsumption.Add((dieselPerM2, dieselFactor));
		}

		// --- Eletricidade na obra (Eq. 23) ---
		decimal electricityKwh = 0m;
		if (config.ElectricityPerM3Concrete > 0 && totalConcreteVolumeM3 > 0)
		{
			electricityKwh = config.ElectricityPerM3Concrete * totalConcreteVolumeM3 / totalArea;
		}

		return new ConstructionStageInput
		{
			ElectricityKwh = electricityKwh,
			FuelConsumption = fuelConsumption,
			MaterialLosses = materialLosses,
			ConstructionWaste = constructionWaste,
		};
	}
}
