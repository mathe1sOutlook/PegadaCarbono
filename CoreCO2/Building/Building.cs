namespace CoreCO2.Building;

/// <summary>
/// Edifício completo com pavimentos e configurações para cálculo de CO₂.
/// Record imutável raiz da hierarquia Building → Floor → StructuralElement.
/// Use BuildingBuilder para construção fluente.
/// </summary>
/// <param name="Name">Nome do edifício (ex.: "Edifício Residencial 24 Pavimentos").</param>
/// <param name="Floors">Lista de pavimentos do edifício.</param>
/// <param name="TransportConfig">Configuração de transporte por tipo de material. Null usa defaults do MaterialCatalog.</param>
/// <param name="ConstructionConfig">Parâmetros do estágio A5 (construção). Null usa defaults.</param>
/// <param name="Description">Descrição opcional do edifício.</param>
/// <param name="ReferencePeriodYears">Período de referência em anos. Default 50 (CT 101).</param>
public record Building(
	string Name,
	IReadOnlyList<Floor> Floors,
	BuildingTransportConfig? TransportConfig = null,
	ConstructionConfig? ConstructionConfig = null,
	string? Description = null,
	int ReferencePeriodYears = 50)
{
	/// <summary>Número total de pavimentos (contabilizando repetições).</summary>
	public int TotalFloorCount => Floors.Sum(f => f.RepetitionCount);

	/// <summary>Área total construída (m²), contabilizando repetições.</summary>
	public decimal TotalAreaM2 => Floors.Sum(f => f.TotalAreaWithRepetitionM2);

	/// <summary>Volume total de concreto (m³), contabilizando repetições.</summary>
	public decimal TotalConcreteVolumeM3 => Floors.Sum(f => f.TotalConcreteVolumeWithRepetitionM3);

	/// <summary>Massa total de aço (kg), contabilizando repetições.</summary>
	public decimal TotalSteelKg => Floors.Sum(f => f.TotalSteelWithRepetitionKg);

	/// <summary>Área total de fôrma (m²), contabilizando repetições.</summary>
	public decimal TotalFormworkM2 => Floors.Sum(f => f.TotalFormworkWithRepetitionM2);

	/// <summary>Massa total de concreto (kg), contabilizando repetições.</summary>
	public decimal TotalConcreteMassKg => Floors.Sum(f => f.TotalConcreteMassKg * f.RepetitionCount);

	/// <summary>Massa total de materiais (concreto + aço) em kg.</summary>
	public decimal TotalMaterialMassKg => TotalConcreteMassKg + TotalSteelKg;

	/// <summary>Consumo de materiais por m² (kg/m²). Benchmark CT 101: ~591 kg/m².</summary>
	public decimal MaterialConsumptionKgPerM2 =>
		TotalAreaM2 > 0 ? TotalMaterialMassKg / TotalAreaM2 : 0m;

	/// <summary>Espessura média de concreto (m). Benchmark CT 101: ~0.23 m.</summary>
	public decimal AverageConcreteThicknessM =>
		TotalAreaM2 > 0 ? TotalConcreteVolumeM3 / TotalAreaM2 : 0m;

	/// <summary>Taxa média de armadura (kg aço/m³ concreto). Benchmark CT 101: ~80 kg/m³.</summary>
	public decimal AverageSteelRate =>
		TotalConcreteVolumeM3 > 0 ? TotalSteelKg / TotalConcreteVolumeM3 : 0m;
}
