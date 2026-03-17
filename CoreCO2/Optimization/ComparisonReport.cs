using CoreCO2.Reporting;

namespace CoreCO2.Optimization;

/// <summary>
/// Relatório de comparação entre um edifício baseline e uma alternativa.
/// </summary>
public record ComparisonReport
{
	/// <summary>Nome do cenário aplicado.</summary>
	public required string ScenarioName { get; init; }

	/// <summary>Descrição do cenário.</summary>
	public required string ScenarioDescription { get; init; }

	/// <summary>Relatório do edifício baseline.</summary>
	public required BuildingCO2Report Baseline { get; init; }

	/// <summary>Relatório do edifício alternativo.</summary>
	public required BuildingCO2Report Alternative { get; init; }

	// --- Variações absolutas ---

	/// <summary>Redução de CO₂ mínima (kg CO₂/m²). Positivo = melhoria.</summary>
	public decimal ReductionMinKgCO2PerM2 =>
		Baseline.TotalMinKgCO2PerM2 - Alternative.TotalMinKgCO2PerM2;

	/// <summary>Redução de CO₂ máxima (kg CO₂/m²). Positivo = melhoria.</summary>
	public decimal ReductionMaxKgCO2PerM2 =>
		Baseline.TotalMaxKgCO2PerM2 - Alternative.TotalMaxKgCO2PerM2;

	// --- Variações percentuais ---

	/// <summary>Redução percentual mínima. Positivo = melhoria.</summary>
	public decimal ReductionMinPercent => Baseline.TotalMinKgCO2PerM2 > 0
		? Math.Round(ReductionMinKgCO2PerM2 / Baseline.TotalMinKgCO2PerM2 * 100m, 2)
		: 0m;

	/// <summary>Redução percentual máxima. Positivo = melhoria.</summary>
	public decimal ReductionMaxPercent => Baseline.TotalMaxKgCO2PerM2 > 0
		? Math.Round(ReductionMaxKgCO2PerM2 / Baseline.TotalMaxKgCO2PerM2 * 100m, 2)
		: 0m;

	// --- Variações de indicadores ---

	/// <summary>Variação do consumo de material (kg/m²).</summary>
	public decimal MaterialConsumptionDelta =>
		Alternative.MaterialConsumptionKgPerM2 - Baseline.MaterialConsumptionKgPerM2;

	/// <summary>Variação da espessura média de concreto (m).</summary>
	public decimal ConcreteThicknessDelta =>
		Alternative.AverageConcreteThicknessM - Baseline.AverageConcreteThicknessM;

	/// <summary>Variação da taxa de armadura (kg/m³).</summary>
	public decimal SteelRateDelta =>
		Alternative.AverageSteelRate - Baseline.AverageSteelRate;
}
