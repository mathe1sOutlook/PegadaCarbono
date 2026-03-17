using CoreCO2.Abstractions;
using CoreCO2.Building.Elements;
using CoreCO2.Building.Translation;
using CoreCO2.Materials;
using CoreCO2.Models;
using CoreCO2.Reporting;

namespace CoreCO2.Building;

/// <summary>
/// Implementação do serviço de cálculo de CO₂ para edifícios.
/// Orquestra: Building → Translator → ICO2CalculationService → BuildingCO2Report.
/// </summary>
public class BuildingCO2Service : IBuildingCO2Service
{
	private readonly ICO2CalculationService _calculator;
	private readonly IBuildingInventoryTranslator _translator;

	public BuildingCO2Service(
		ICO2CalculationService calculator,
		IBuildingInventoryTranslator translator)
	{
		_calculator = calculator ?? throw new ArgumentNullException(nameof(calculator));
		_translator = translator ?? throw new ArgumentNullException(nameof(translator));
	}

	/// <inheritdoc />
	public BuildingCO2Report Calculate(Building building)
	{
		ArgumentNullException.ThrowIfNull(building);

		var totalArea = building.TotalAreaM2;
		if (totalArea <= 0)
			throw new InvalidOperationException("Área total do edifício deve ser maior que zero.");

		// 1. Traduzir Building → dados de entrada do motor
		var data = _translator.Translate(building);

		// 2. Calcular A1-A3 (estágio de produto)
		var productResult = _calculator.CalculateProductStage(data.ProductStageInventory);

		// 3. Calcular A4 (transporte até a obra)
		var a4 = _calculator.CalculateTransportToSite(data.TransportToSiteItems);

		// 4. Calcular A5 min/max (construção)
		var a5Min = _calculator.CalculateConstructionStage(data.ConstructionInputMin);
		var a5Max = _calculator.CalculateConstructionStage(data.ConstructionInputMax);

		// 5. Agregar totais
		var totalMin = productResult.TotalMin + a4 + a5Min;
		var totalMax = productResult.TotalMax + a4 + a5Max;

		// 6. Calcular contribuições por material (usando valores max)
		var (concretePercent, steelPercent, formworkPercent, transportPercent) =
			CalculateMaterialContributions(productResult, a4, a5Max, totalMax);

		// 7. Gerar relatórios por pavimento
		var floorReports = GenerateFloorReports(building);

		// 8. Calcular consumo de material total (A1-A5)
		// MaterialConsumption do productResult = A1-A3 (concreto + aço sem perdas)
		// Adicionar perdas + fôrmas (A5)
		var config = building.ConstructionConfig ?? new ConstructionConfig();
		var a5MaterialKgPerM2 = CalculateA5MaterialConsumption(building, config);
		var totalMaterialKgPerM2 = productResult.MaterialConsumption + a5MaterialKgPerM2;

		return new BuildingCO2Report
		{
			BuildingName = building.Name,

			TotalMinKgCO2PerM2 = Math.Round(totalMin, 2),
			TotalMaxKgCO2PerM2 = Math.Round(totalMax, 2),
			TotalMinKgCO2 = Math.Round(totalMin * totalArea, 0),
			TotalMaxKgCO2 = Math.Round(totalMax * totalArea, 0),

			MaterialConsumptionKgPerM2 = Math.Round(totalMaterialKgPerM2, 1),
			AverageConcreteThicknessM = Math.Round(building.AverageConcreteThicknessM, 4),
			AverageSteelRate = Math.Round(building.AverageSteelRate, 1),
			TotalAreaM2 = totalArea,

			A1A3MinKgCO2PerM2 = Math.Round(productResult.TotalMin, 2),
			A1A3MaxKgCO2PerM2 = Math.Round(productResult.TotalMax, 2),
			A4KgCO2PerM2 = Math.Round(a4, 2),
			A5MinKgCO2PerM2 = Math.Round(a5Min, 2),
			A5MaxKgCO2PerM2 = Math.Round(a5Max, 2),

			ConcreteContributionPercent = concretePercent,
			SteelContributionPercent = steelPercent,
			FormworkContributionPercent = formworkPercent,
			TransportContributionPercent = transportPercent,

			Hotspots = productResult.Hotspots,
			FloorReports = floorReports,
		};
	}

	/// <summary>
	/// Calcula contribuições percentuais por material usando os hotspots do resultado A1-A3.
	/// </summary>
	private static (decimal concrete, decimal steel, decimal formwork, decimal transport)
		CalculateMaterialContributions(CO2Result productResult, decimal a4, decimal a5Max, decimal totalMax)
	{
		if (totalMax <= 0) return (0, 0, 0, 0);

		decimal concreteEmission = 0m;
		decimal steelEmission = 0m;

		foreach (var hotspot in productResult.Hotspots)
		{
			if (hotspot.ItemName.StartsWith("Concreto", StringComparison.Ordinal))
				concreteEmission += hotspot.EmissionKgCO2;
			else if (hotspot.ItemName.StartsWith("Aço", StringComparison.Ordinal))
				steelEmission += hotspot.EmissionKgCO2;
		}

		// A5 tem fôrma + perdas de concreto/aço + diesel
		// Aproximação: concreto inclui suas perdas, aço inclui suas perdas, fôrma é o restante do A5
		var formworkAndOther = a5Max;
		var transportEmission = a4;

		return (
			Math.Round(concreteEmission / totalMax * 100m, 1),
			Math.Round(steelEmission / totalMax * 100m, 1),
			Math.Round(formworkAndOther / totalMax * 100m, 1),
			Math.Round(transportEmission / totalMax * 100m, 1));
	}

	/// <summary>
	/// Gera relatórios de emissão por pavimento e por elemento.
	/// Usa fatores do MaterialCatalog para calcular emissões por elemento.
	/// </summary>
	private static List<FloorCO2Report> GenerateFloorReports(Building building)
	{
		var reports = new List<FloorCO2Report>();

		foreach (var floor in building.Floors)
		{
			var elementReports = new List<ElementCO2Report>();

			foreach (var element in floor.Elements)
			{
				var concreteFactor = element.GetConcreteEmissionFactor();
				var steelFactor = element.GetSteelEmissionFactor();
				var formworkFactor = element.GetFormworkEmissionFactor();

				var concreteMin = element.ConcreteVolumeM3 * concreteFactor.ValueMin;
				var concreteMax = element.ConcreteVolumeM3 * concreteFactor.ValueMax;
				var steelMin = element.SteelQuantityKg * steelFactor.ValueMin;
				var steelMax = element.SteelQuantityKg * steelFactor.ValueMax;

				// Fôrma: área efetiva × fator
				var effectiveArea = element.EffectiveFormworkAreaM2;
				var formworkMin = effectiveArea * formworkFactor.ValueMin;
				var formworkMax = effectiveArea * formworkFactor.ValueMax;

				elementReports.Add(new ElementCO2Report(
					element.Name,
					element.ElementType,
					Math.Round(concreteMin, 2),
					Math.Round(concreteMax, 2),
					Math.Round(steelMin, 2),
					Math.Round(steelMax, 2),
					Math.Round(formworkMin, 2),
					Math.Round(formworkMax, 2)));
			}

			// Totais do pavimento (1 pavimento × repetições)
			var singleFloorMin = elementReports.Sum(e => e.TotalMin);
			var singleFloorMax = elementReports.Sum(e => e.TotalMax);
			var totalMin = singleFloorMin * floor.RepetitionCount;
			var totalMax = singleFloorMax * floor.RepetitionCount;

			reports.Add(new FloorCO2Report(
				floor.Name,
				floor.FloorType,
				floor.RepetitionCount,
				floor.AreaM2,
				Math.Round(totalMin, 2),
				Math.Round(totalMax, 2),
				elementReports));
		}

		return reports;
	}

	/// <summary>
	/// Calcula o consumo de material no A5 (perdas + fôrmas) em kg/m².
	/// </summary>
	private static decimal CalculateA5MaterialConsumption(Building building, ConstructionConfig config)
	{
		var totalArea = building.TotalAreaM2;
		if (totalArea <= 0) return 0m;

		decimal a5MaterialKg = 0m;

		foreach (var floor in building.Floors)
		{
			var reps = floor.RepetitionCount;
			foreach (var element in floor.Elements)
			{
				// Perdas de concreto
				var concreteLossVol = element.ConcreteVolumeM3 * config.ConcreteLossFraction;
				var density = MaterialCatalog.ConcreteDensities.TryGetValue(element.ConcreteGrade, out var d) ? d : 2400m;
				a5MaterialKg += concreteLossVol * density * reps;

				// Perdas de aço
				a5MaterialKg += element.SteelQuantityKg * config.SteelLossFraction * reps;

				// Fôrma consumida
				var effectiveFormwork = element.EffectiveFormworkAreaM2 * reps;
				a5MaterialKg += element.FormworkMaterial switch
				{
					FormworkMaterial.CompensadoPlastificado => effectiveFormwork * 9.0m,
					FormworkMaterial.MadeiraSerradaBruta => effectiveFormwork * 600m,
					_ => 0m,
				};
			}
		}

		return a5MaterialKg / totalArea;
	}
}
