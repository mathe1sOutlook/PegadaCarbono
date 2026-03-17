using CoreCO2.Models;

namespace CoreCO2.Reporting;

/// <summary>
/// Relatório completo de emissão de CO₂ do edifício.
/// Valores normalizados por m² de área construída (unidade funcional CT 101).
/// </summary>
public record BuildingCO2Report
{
	/// <summary>Nome do edifício.</summary>
	public required string BuildingName { get; init; }

	// --- Totais por m² ---

	/// <summary>Emissão total mínima (kg CO₂/m²). Benchmark CT 101: ~70.</summary>
	public required decimal TotalMinKgCO2PerM2 { get; init; }

	/// <summary>Emissão total máxima (kg CO₂/m²). Benchmark CT 101: ~111.</summary>
	public required decimal TotalMaxKgCO2PerM2 { get; init; }

	// --- Totais absolutos ---

	/// <summary>Emissão total mínima absoluta (kg CO₂ do edifício inteiro).</summary>
	public required decimal TotalMinKgCO2 { get; init; }

	/// <summary>Emissão total máxima absoluta (kg CO₂ do edifício inteiro).</summary>
	public required decimal TotalMaxKgCO2 { get; init; }

	// --- Indicadores de consumo ---

	/// <summary>Consumo de material por m² (kg/m²). Benchmark CT 101: ~591.</summary>
	public required decimal MaterialConsumptionKgPerM2 { get; init; }

	/// <summary>Espessura média de concreto (m). Benchmark CT 101: ~0.23.</summary>
	public required decimal AverageConcreteThicknessM { get; init; }

	/// <summary>Taxa média de armadura (kg aço/m³ concreto). Benchmark CT 101: ~80.</summary>
	public required decimal AverageSteelRate { get; init; }

	/// <summary>Área total construída (m²).</summary>
	public required decimal TotalAreaM2 { get; init; }

	// --- Desdobramento por módulo do ciclo de vida ---

	/// <summary>Emissão A1-A3 mínima (kg CO₂/m²). ~91% do total.</summary>
	public required decimal A1A3MinKgCO2PerM2 { get; init; }

	/// <summary>Emissão A1-A3 máxima (kg CO₂/m²).</summary>
	public required decimal A1A3MaxKgCO2PerM2 { get; init; }

	/// <summary>Emissão A4 — transporte até a obra (kg CO₂/m²). ~1% do total.</summary>
	public required decimal A4KgCO2PerM2 { get; init; }

	/// <summary>Emissão A5 mínima — construção (kg CO₂/m²). ~8% do total.</summary>
	public required decimal A5MinKgCO2PerM2 { get; init; }

	/// <summary>Emissão A5 máxima — construção (kg CO₂/m²).</summary>
	public required decimal A5MaxKgCO2PerM2 { get; init; }

	// --- Desdobramento por material (percentual do total max) ---

	/// <summary>Contribuição do concreto (% do total máximo). Benchmark: ~77%.</summary>
	public required decimal ConcreteContributionPercent { get; init; }

	/// <summary>Contribuição do aço (% do total máximo). Benchmark: ~18%.</summary>
	public required decimal SteelContributionPercent { get; init; }

	/// <summary>Contribuição das fôrmas (% do total máximo).</summary>
	public required decimal FormworkContributionPercent { get; init; }

	/// <summary>Contribuição do transporte (% do total máximo).</summary>
	public required decimal TransportContributionPercent { get; init; }

	// --- Desdobramento por módulo (percentual) ---

	/// <summary>A1-A3 como % do total máximo.</summary>
	public decimal A1A3Percent => TotalMaxKgCO2PerM2 > 0
		? Math.Round(A1A3MaxKgCO2PerM2 / TotalMaxKgCO2PerM2 * 100m, 1)
		: 0m;

	/// <summary>A4 como % do total máximo.</summary>
	public decimal A4Percent => TotalMaxKgCO2PerM2 > 0
		? Math.Round(A4KgCO2PerM2 / TotalMaxKgCO2PerM2 * 100m, 1)
		: 0m;

	/// <summary>A5 como % do total máximo.</summary>
	public decimal A5Percent => TotalMaxKgCO2PerM2 > 0
		? Math.Round(A5MaxKgCO2PerM2 / TotalMaxKgCO2PerM2 * 100m, 1)
		: 0m;

	// --- Hotspots do produto (A1-A3) ---

	/// <summary>Análise de hotspots do estágio de produto.</summary>
	public required IReadOnlyList<HotspotItem> Hotspots { get; init; }

	// --- Relatórios por pavimento ---

	/// <summary>Relatórios de emissão por pavimento.</summary>
	public required IReadOnlyList<FloorCO2Report> FloorReports { get; init; }
}
