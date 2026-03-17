using CoreCO2.Building.Elements;
using CoreCO2.Materials;

namespace CoreCO2.Building;

/// <summary>
/// Pavimento de um edifício com seus elementos estruturais.
/// Record imutável. Use FloorBuilder para construção fluente.
/// </summary>
/// <param name="Name">Nome do pavimento (ex.: "1º Pavimento Tipo", "Fundação").</param>
/// <param name="FloorType">Tipo do pavimento.</param>
/// <param name="FloorHeightM">Pé-direito do pavimento (m).</param>
/// <param name="AreaM2">Área do pavimento (m²).</param>
/// <param name="Elements">Elementos estruturais do pavimento.</param>
/// <param name="RepetitionCount">Número de repetições (pavimentos tipo). Default 1.</param>
public record Floor(
	string Name,
	FloorType FloorType,
	decimal FloorHeightM,
	decimal AreaM2,
	IReadOnlyList<StructuralElement> Elements,
	int RepetitionCount = 1)
{
	/// <summary>Pilares do pavimento.</summary>
	public IEnumerable<StructuralElement> Pilares =>
		Elements.Where(e => e.ElementType == StructuralElementType.Pilar);

	/// <summary>Vigas do pavimento.</summary>
	public IEnumerable<StructuralElement> Vigas =>
		Elements.Where(e => e.ElementType == StructuralElementType.Viga);

	/// <summary>Lajes do pavimento.</summary>
	public IEnumerable<StructuralElement> Lajes =>
		Elements.Where(e => e.ElementType == StructuralElementType.Laje);

	/// <summary>Elementos de fundação do pavimento.</summary>
	public IEnumerable<StructuralElement> Fundacoes =>
		Elements.Where(e => e.ElementType is StructuralElementType.Sapata
			or StructuralElementType.BlocoFundacao
			or StructuralElementType.Tubulao
			or StructuralElementType.Estaca
			or StructuralElementType.Radier);

	/// <summary>Volume total de concreto do pavimento (m³) — sem repetição.</summary>
	public decimal TotalConcreteVolumeM3 => Elements.Sum(e => e.ConcreteVolumeM3);

	/// <summary>Massa total de aço do pavimento (kg) — sem repetição.</summary>
	public decimal TotalSteelKg => Elements.Sum(e => e.SteelQuantityKg);

	/// <summary>Área total de fôrma do pavimento (m²) — sem repetição.</summary>
	public decimal TotalFormworkM2 => Elements.Sum(e => e.FormworkAreaM2);

	/// <summary>Massa total de concreto do pavimento (kg) — sem repetição.</summary>
	public decimal TotalConcreteMassKg => Elements.Sum(e => e.ConcreteMassKg);

	/// <summary>Taxa média de armadura (kg aço / m³ concreto).</summary>
	public decimal AverageSteelRate =>
		TotalConcreteVolumeM3 > 0 ? TotalSteelKg / TotalConcreteVolumeM3 : 0m;

	/// <summary>Espessura média de concreto (m): Volume / Área do pavimento.</summary>
	public decimal AverageConcreteThicknessM =>
		AreaM2 > 0 ? TotalConcreteVolumeM3 / AreaM2 : 0m;

	/// <summary>Volume total considerando repetições (m³).</summary>
	public decimal TotalConcreteVolumeWithRepetitionM3 => TotalConcreteVolumeM3 * RepetitionCount;

	/// <summary>Massa total de aço considerando repetições (kg).</summary>
	public decimal TotalSteelWithRepetitionKg => TotalSteelKg * RepetitionCount;

	/// <summary>Área total de fôrma considerando repetições (m²).</summary>
	public decimal TotalFormworkWithRepetitionM2 => TotalFormworkM2 * RepetitionCount;

	/// <summary>Área total considerando repetições (m²).</summary>
	public decimal TotalAreaWithRepetitionM2 => AreaM2 * RepetitionCount;
}
