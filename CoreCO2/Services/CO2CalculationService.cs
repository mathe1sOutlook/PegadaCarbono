using CoreCO2.Abstractions;
using CoreCO2.Models;

namespace CoreCO2.Services;

/// <summary>
/// Implementação do serviço de cálculo de emissões de CO₂ conforme CT 101.
/// Equações 1-58 do Boletim Técnico IBRACON/ABECE/ABCIC.
/// </summary>
public sealed class CO2CalculationService : ICO2CalculationService
{
	private readonly IEmissionFactorProvider _factorProvider;

	public CO2CalculationService(IEmissionFactorProvider factorProvider)
	{
		_factorProvider = factorProvider ?? throw new ArgumentNullException(nameof(factorProvider));
	}

	/// <inheritdoc />
	/// <remarks>Equação 5: C_j = Σ(q_i,j × e_i)</remarks>
	public decimal CalculateSimpleEmission(IEnumerable<(decimal quantity, decimal emissionFactor)> items)
	{
		ArgumentNullException.ThrowIfNull(items);
		return items.Sum(item => item.quantity * item.emissionFactor);
	}

	/// <inheritdoc />
	/// <remarks>Equação 10: C_t = Σ(q_i × m_i/1000 × d_t,i × e_t,i)</remarks>
	public decimal CalculateTransportEmission(IEnumerable<TransportItem> items)
	{
		ArgumentNullException.ThrowIfNull(items);
		return items.Sum(item => item.Emission);
	}

	/// <inheritdoc />
	/// <remarks>Equação 7: C_comb = Σ(q_comb,i × e_comb,i)</remarks>
	public decimal CalculateCombustionEmission(IEnumerable<(decimal quantity, decimal emissionFactor)> fuelQuantities)
	{
		return CalculateSimpleEmission(fuelQuantities);
	}

	/// <inheritdoc />
	/// <remarks>Equação 8: C_calc = q_calc × e_calc</remarks>
	public decimal CalculateCalcinationEmission(decimal carbonateQuantityKg, decimal emissionFactor)
	{
		return carbonateQuantityKg * emissionFactor;
	}

	/// <inheritdoc />
	/// <remarks>Equação 9: C_biomassa = biomassa_seca × 0.5 × (44/12)</remarks>
	public decimal CalculateBiomassEmission(decimal dryBiomassKg)
	{
		const decimal carbonFraction = 0.5m;
		const decimal co2ToCarbonRatio = 44m / 12m; // ≈ 3.667
		return dryBiomassKg * carbonFraction * co2ToCarbonRatio;
	}

	/// <inheritdoc />
	/// <remarks>Equações 12-19, 44-55 do CT 101. Desdobra A1/A2/A3 conforme Anexo A.</remarks>
	public CO2Result CalculateProductStage(Inventory inventory)
	{
		ArgumentNullException.ThrowIfNull(inventory);

		var emissionsByItemMin = new Dictionary<string, decimal>();
		var emissionsByItemMax = new Dictionary<string, decimal>();
		var emissionsByCategory = new Dictionary<EmissionCategory, decimal>();

		decimal totalMin = 0m;
		decimal totalMax = 0m;
		decimal materialConsumption = 0m;

		// Desdobramento A1/A2/A3 conforme Anexo A (Eq. 44-55)
		decimal a1Total = 0m; // Eq. 45-47: materiais (sem perdas) + eletricidade
		decimal a2Total = 0m; // Eq. 48: transporte (sem perdas)
		decimal a3Total = 0m; // Eq. 49-55: combustão + perdas(mat+transp) + resíduos

		foreach (var entry in inventory.Inputs)
		{
			decimal quantityWithoutLoss = entry.Quantity;
			decimal quantityWithLoss = entry.Quantity * (1m + inventory.LossRatio);
			decimal lossQuantity = entry.Quantity * inventory.LossRatio;

			// Emissão do material processado (Eq. 13: total com perdas)
			if (inventory.EmissionFactors.TryGetValue(entry.ItemName, out var factor))
			{
				decimal materialEmissionMin = CalculateMaterialEmission(quantityWithLoss, entry, factor.ValueMin);
				decimal materialEmissionMax = CalculateMaterialEmission(quantityWithLoss, entry, factor.ValueMax);

				AccumulateEmission(emissionsByItemMin, $"{entry.ItemName} (material)", materialEmissionMin);
				AccumulateEmission(emissionsByItemMax, $"{entry.ItemName} (material)", materialEmissionMax);
				AccumulateCategory(emissionsByCategory, entry.Category, materialEmissionMax);

				totalMin += materialEmissionMin;
				totalMax += materialEmissionMax;

				// A1 (Eq. 46): emissões dos materiais SEM perdas
				decimal a1MaterialMax = CalculateMaterialEmission(quantityWithoutLoss, entry, factor.ValueMax);
				a1Total += a1MaterialMax;

				// A3 (Eq. 53): emissões dos materiais das PERDAS
				decimal a3LossMaterialMax = CalculateMaterialEmission(lossQuantity, entry, factor.ValueMax);
				a3Total += a3LossMaterialMax;
			}

			// Emissão de transporte (Eq. 14: total com perdas)
			if (entry.TransportMode.HasValue && entry.TransportDistanceKm > 0)
			{
				var transportFactor = _factorProvider.GetTransportFactor(entry.TransportMode.Value);
				decimal massKg = quantityWithLoss * entry.MassConversionFactor;
				decimal transportEmission = massKg / 1000m * entry.TransportDistanceKm * transportFactor.ValueMin;

				AccumulateEmission(emissionsByItemMin, $"{entry.ItemName} (transporte)", transportEmission);
				AccumulateEmission(emissionsByItemMax, $"{entry.ItemName} (transporte)", transportEmission);
				AccumulateCategory(emissionsByCategory, EmissionCategory.Transport, transportEmission);

				totalMin += transportEmission;
				totalMax += transportEmission;

				// A2 (Eq. 48): transporte SEM perdas
				decimal massWithoutLoss = quantityWithoutLoss * entry.MassConversionFactor;
				decimal a2Transport = massWithoutLoss / 1000m * entry.TransportDistanceKm * transportFactor.ValueMin;
				a2Total += a2Transport;

				// A3 (Eq. 54): transporte das PERDAS
				decimal massLoss = lossQuantity * entry.MassConversionFactor;
				decimal a3LossTransport = massLoss / 1000m * entry.TransportDistanceKm * transportFactor.ValueMin;
				a3Total += a3LossTransport;
			}

			// Consumo de material (Eq. 43)
			materialConsumption += quantityWithLoss * entry.MassConversionFactor;
		}

		// Emissão direta (ex.: combustão de diesel na central) → A3 (Eq. 50)
		if (inventory.DirectEmission > 0)
		{
			AccumulateEmission(emissionsByItemMin, "Emissão direta", inventory.DirectEmission);
			AccumulateEmission(emissionsByItemMax, "Emissão direta", inventory.DirectEmission);
			AccumulateCategory(emissionsByCategory, EmissionCategory.FuelCombustion, inventory.DirectEmission);
			totalMin += inventory.DirectEmission;
			totalMax += inventory.DirectEmission;
			a3Total += inventory.DirectEmission;
		}

		// Emissões de transporte de resíduos → A3 (Eq. 54*)
		foreach (var entry in inventory.Outputs.Where(e => e.TransportMode.HasValue && e.TransportDistanceKm > 0))
		{
			var transportFactor = _factorProvider.GetTransportFactor(entry.TransportMode!.Value);
			decimal massKg = entry.Quantity * entry.MassConversionFactor;
			decimal transportEmission = massKg / 1000m * entry.TransportDistanceKm * transportFactor.ValueMin;

			AccumulateEmission(emissionsByItemMin, $"{entry.ItemName} (transporte)", transportEmission);
			AccumulateEmission(emissionsByItemMax, $"{entry.ItemName} (transporte)", transportEmission);
			AccumulateCategory(emissionsByCategory, EmissionCategory.Transport, transportEmission);

			totalMin += transportEmission;
			totalMax += transportEmission;
			a3Total += transportEmission;
		}

		// Emissões de disposição de resíduos → A3 (Eq. 19/55)
		foreach (var entry in inventory.Outputs.Where(e => e.DisposalEmissionFactor > 0))
		{
			decimal massKg = entry.Quantity * entry.MassConversionFactor;
			decimal disposalEmission = massKg * entry.DisposalEmissionFactor;

			AccumulateEmission(emissionsByItemMin, $"{entry.ItemName} (disposição)", disposalEmission);
			AccumulateEmission(emissionsByItemMax, $"{entry.ItemName} (disposição)", disposalEmission);
			AccumulateCategory(emissionsByCategory, EmissionCategory.WasteDisposal, disposalEmission);

			totalMin += disposalEmission;
			totalMax += disposalEmission;
			a3Total += disposalEmission;
		}

		// Crédito de carbonatação (Eq. 11)
		if (inventory.CarbonationRemoval > 0)
		{
			decimal carbonationCredit = -inventory.CarbonationRemoval;
			AccumulateEmission(emissionsByItemMin, "Carbonatação (remoção)", carbonationCredit);
			AccumulateEmission(emissionsByItemMax, "Carbonatação (remoção)", carbonationCredit);
			AccumulateCategory(emissionsByCategory, EmissionCategory.Carbonation, carbonationCredit);
			totalMin += carbonationCredit;
			totalMax += carbonationCredit;
		}

		// Hotspots (usando valores máximos)
		var hotspots = AnalyzeHotspots(
			emissionsByItemMax.Select(kvp => (kvp.Key, kvp.Value)));

		// Módulos A1-A3 desdobrados (Eq. 44)
		var byModule = new Dictionary<LifeCycleModule, decimal>
		{
			[LifeCycleModule.A1] = a1Total,
			[LifeCycleModule.A2] = a2Total,
			[LifeCycleModule.A3] = a3Total,
		};

		return new CO2Result(totalMin, totalMax, byModule, emissionsByCategory, hotspots, materialConsumption);
	}

	/// <inheritdoc />
	/// <remarks>Equação 1: n_i = ⌈PR / VU_i⌉ − 1</remarks>
	public int CalculateReplacements(int referencePeriodYears, int materialLifeYears)
	{
		if (materialLifeYears <= 0)
			throw new ArgumentException("Vida útil do material deve ser positiva.", nameof(materialLifeYears));

		return (int)Math.Ceiling((decimal)referencePeriodYears / materialLifeYears) - 1;
	}

	/// <inheritdoc />
	/// <remarks>Equação 21: mesma fórmula de transporte, distâncias fábrica→obra.</remarks>
	public decimal CalculateTransportToSite(IEnumerable<TransportItem> items)
	{
		return CalculateTransportEmission(items);
	}

	/// <inheritdoc />
	/// <remarks>Equações 57-58 do Anexo B (propagação de incertezas por Taylor).</remarks>
	public UncertaintyResult PropagateUncertainty(
		IEnumerable<(decimal quantity, decimal factorMin, decimal factorMax)> items)
	{
		ArgumentNullException.ThrowIfNull(items);

		var list = items.ToList();
		decimal centralEstimate = 0m;
		decimal varianceSum = 0m;

		foreach (var (quantity, factorMin, factorMax) in list)
		{
			// Eq. 57: ē_i = (min + max) / 2
			decimal centralFactor = (factorMin + factorMax) / 2m;
			centralEstimate += quantity * centralFactor;

			// Eq. 58: dp(e_i) = (max - min) / 4 (±2σ cobre ~95%)
			decimal stdDevFactor = (factorMax - factorMin) / 4m;
			varianceSum += quantity * quantity * stdDevFactor * stdDevFactor;
		}

		decimal standardDeviation = (decimal)Math.Sqrt((double)varianceSum);
		return new UncertaintyResult(centralEstimate, standardDeviation);
	}

	/// <inheritdoc />
	/// <remarks>Equações 22-29: C_A5 = C_elet + C_comb + C_perdas.</remarks>
	public decimal CalculateConstructionStage(ConstructionStageInput input)
	{
		ArgumentNullException.ThrowIfNull(input);

		decimal total = 0m;

		// Eq. 23: eletricidade na obra
		if (input.ElectricityKwh > 0)
		{
			var gridFactor = _factorProvider.GetElectricityFactor();
			total += input.ElectricityKwh * gridFactor.ValueMin;
		}

		// Eq. 24: combustão na obra
		total += CalculateCombustionEmission(input.FuelConsumption);

		// Eq. 26: emissões incorporadas nos materiais desperdiçados
		foreach (var (_, wastedQty, a1a3Factor) in input.MaterialLosses)
			total += wastedQty * a1a3Factor;

		// Eq. 27: transporte dos materiais desperdiçados
		total += CalculateTransportEmission(input.DiscardedMaterialTransport);

		// Eq. 28-29: transporte e disposição de resíduos da obra
		foreach (var waste in input.ConstructionWaste)
		{
			var transportFactor = _factorProvider.GetTransportFactor(waste.TransportMode);
			// Eq. 28: transporte de resíduos
			total += waste.QuantityKg / 1000m * waste.TransportDistanceKm * transportFactor.ValueMin;
			// Eq. 29: processamento/reciclagem + disposição final
			total += waste.QuantityKg * waste.RecyclingEmissionFactor;
			total += waste.QuantityKg * waste.DisposalEmissionFactor;
		}

		return total;
	}

	/// <inheritdoc />
	/// <remarks>Equações 35-40: C_f = C_C1 + C_C2 + C_C3 + C_C4.</remarks>
	public EndOfLifeResult CalculateEndOfLife(EndOfLifeInput input)
	{
		ArgumentNullException.ThrowIfNull(input);

		// Eq. 36-37: C1 = demolição (eletricidade + combustão)
		decimal c1 = 0m;
		if (input.DemolitionElectricityKwh > 0)
		{
			var gridFactor = _factorProvider.GetElectricityFactor();
			c1 += input.DemolitionElectricityKwh * gridFactor.ValueMin;
		}
		c1 += CalculateCombustionEmission(input.DemolitionFuel);

		// Eq. 38-40: C2 + C3 + C4 from demolition waste
		decimal c2 = 0m;
		decimal c3 = 0m;
		decimal c4 = 0m;
		foreach (var waste in input.DemolitionWaste)
		{
			var transportFactor = _factorProvider.GetTransportFactor(waste.TransportMode);
			// Eq. 38: C2 = transporte de resíduos
			c2 += waste.QuantityKg / 1000m * waste.TransportDistanceKm * transportFactor.ValueMin;
			// Eq. 39: C3 = processamento/reciclagem
			c3 += waste.QuantityKg * waste.RecyclingEmissionFactor;
			// Eq. 40: C4 = disposição final
			c4 += waste.QuantityKg * waste.DisposalEmissionFactor;
		}

		decimal total = c1 + c2 + c3 + c4;
		return new EndOfLifeResult(total, c1, c2, c3, c4);
	}

	/// <inheritdoc />
	/// <remarks>Equações 30-34: B4 = produção + transporte + resíduos das substituições.</remarks>
	public ReplacementResult CalculateReplacementStage(ReplacementInput input)
	{
		ArgumentNullException.ThrowIfNull(input);

		decimal productionTotal = 0m;
		decimal transportTotal = 0m;
		decimal wasteTotal = 0m;
		var details = new List<ReplacementDetail>();

		foreach (var material in input.Materials)
		{
			int n = CalculateReplacements(input.ReferencePeriodYears, material.MaterialLifeYears);
			if (n <= 0)
			{
				details.Add(new ReplacementDetail(material.ItemName, 0, 0m));
				continue;
			}

			decimal itemTotal = 0m;

			// Eq. 31: produção dos materiais de reposição
			decimal production = n * material.QuantityPerReplacement * material.A1A3Factor;
			productionTotal += production;
			itemTotal += production;

			// Eq. 32: transporte dos materiais de reposição
			if (material.TransportToSite is not null)
			{
				decimal transport = n * material.TransportToSite.Emission;
				transportTotal += transport;
				itemTotal += transport;
			}

			// Eq. 33-34: transporte e disposição de resíduos do material antigo
			if (material.Waste is not null)
			{
				var transportFactor = _factorProvider.GetTransportFactor(material.Waste.TransportMode);
				decimal wasteTransport = n * material.Waste.QuantityKg / 1000m
					* material.Waste.TransportDistanceKm * transportFactor.ValueMin;
				decimal wasteDisposal = n * material.Waste.QuantityKg * material.Waste.DisposalEmissionFactor;
				wasteTotal += wasteTransport + wasteDisposal;
				itemTotal += wasteTransport + wasteDisposal;
			}

			details.Add(new ReplacementDetail(material.ItemName, n, itemTotal));
		}

		decimal total = productionTotal + transportTotal + wasteTotal;
		return new ReplacementResult(total, productionTotal, transportTotal, wasteTotal, details);
	}

	/// <inheritdoc />
	public IReadOnlyList<HotspotItem> AnalyzeHotspots(
		IEnumerable<(string itemName, decimal emissionKgCO2)> itemEmissions)
	{
		ArgumentNullException.ThrowIfNull(itemEmissions);

		var items = itemEmissions.ToList();
		decimal total = items.Sum(i => i.emissionKgCO2);

		if (total <= 0m)
			return [];

		return items
			.Select(i => new HotspotItem(
				i.itemName,
				i.emissionKgCO2,
				Math.Round(i.emissionKgCO2 / total * 100m, 2)))
			.OrderByDescending(h => h.Percentage)
			.ToList();
	}

	private static decimal CalculateMaterialEmission(decimal quantity, InventoryEntry entry, decimal factor)
	{
		// Para materiais com fator em kg CO₂/t, converter quantidade de kg para t
		if (entry.DeclaredUnit == "kg" && factor > 100m)
			return quantity / 1000m * factor;

		return quantity * factor;
	}

	private static void AccumulateEmission(Dictionary<string, decimal> dict, string key, decimal value)
	{
		if (dict.ContainsKey(key))
			dict[key] += value;
		else
			dict[key] = value;
	}

	private static void AccumulateCategory(Dictionary<EmissionCategory, decimal> dict, EmissionCategory key, decimal value)
	{
		if (dict.ContainsKey(key))
			dict[key] += value;
		else
			dict[key] = value;
	}
}
