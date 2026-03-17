using CoreCO2.Materials;
using CoreCO2.Models;

namespace CoreCO2.Building.Elements;

/// <summary>
/// Elemento estrutural de concreto armado com dados de concreto, aço e fôrma.
/// Record imutável representando um elemento individual (pilar, viga, laje, etc.).
/// </summary>
/// <param name="Name">Nome do elemento (ex.: "Pilar P1", "Viga V101", "Laje L1").</param>
/// <param name="ElementType">Tipo do elemento estrutural.</param>
/// <param name="ConcreteVolumeM3">Volume de concreto (m³).</param>
/// <param name="ConcreteGrade">Classe de resistência do concreto.</param>
/// <param name="SteelQuantityKg">Quantidade de aço (kg).</param>
/// <param name="SteelGrade">Tipo do aço (CA-50 ou CA-60).</param>
/// <param name="FormworkAreaM2">Área de fôrma (m²).</param>
/// <param name="FormworkMaterial">Material da fôrma.</param>
/// <param name="FormworkReuses">Número de reutilizações da fôrma. Default 12 (CT 101).</param>
/// <param name="CustomConcreteEmissionFactor">Fator de emissão customizado para concreto (sobrescreve MaterialCatalog).</param>
/// <param name="CustomSteelEmissionFactor">Fator de emissão customizado para aço (sobrescreve MaterialCatalog).</param>
public record StructuralElement(
	string Name,
	StructuralElementType ElementType,
	decimal ConcreteVolumeM3,
	ConcreteGrade ConcreteGrade,
	decimal SteelQuantityKg,
	SteelGrade SteelGrade = SteelGrade.CA50,
	decimal FormworkAreaM2 = 0m,
	FormworkMaterial FormworkMaterial = FormworkMaterial.CompensadoPlastificado,
	int FormworkReuses = 12,
	EmissionFactor? CustomConcreteEmissionFactor = null,
	EmissionFactor? CustomSteelEmissionFactor = null)
{
	/// <summary>Taxa de armadura (kg aço / m³ concreto). Benchmark CT 101: ~80 kg/m³.</summary>
	public decimal SteelRate => ConcreteVolumeM3 > 0 ? SteelQuantityKg / ConcreteVolumeM3 : 0m;

	/// <summary>Massa de concreto estimada (kg), usando densidade do MaterialCatalog.</summary>
	public decimal ConcreteMassKg =>
		MaterialCatalog.ConcreteDensities.TryGetValue(ConcreteGrade, out var density)
			? ConcreteVolumeM3 * density
			: ConcreteVolumeM3 * 2400m; // fallback: 2400 kg/m³

	/// <summary>Área de fôrma efetiva por uso (m²), considerando reutilizações.</summary>
	public decimal EffectiveFormworkAreaM2 =>
		FormworkReuses > 0 ? FormworkAreaM2 / FormworkReuses : FormworkAreaM2;

	/// <summary>
	/// Obtém o fator de emissão do concreto: custom ou do catálogo.
	/// </summary>
	public EmissionFactor GetConcreteEmissionFactor() =>
		CustomConcreteEmissionFactor
		?? (MaterialCatalog.ConcreteFactors.TryGetValue(ConcreteGrade, out var f) ? f : throw new InvalidOperationException($"Fator de emissão não encontrado para {ConcreteGrade}."));

	/// <summary>
	/// Obtém o fator de emissão do aço: custom ou do catálogo.
	/// </summary>
	public EmissionFactor GetSteelEmissionFactor() =>
		CustomSteelEmissionFactor
		?? (MaterialCatalog.SteelFactors.TryGetValue(SteelGrade, out var f) ? f : throw new InvalidOperationException($"Fator de emissão não encontrado para {SteelGrade}."));

	/// <summary>
	/// Obtém o fator de emissão da fôrma do catálogo.
	/// </summary>
	public EmissionFactor GetFormworkEmissionFactor() =>
		MaterialCatalog.FormworkFactors.TryGetValue(FormworkMaterial, out var f)
			? f
			: throw new InvalidOperationException($"Fator de emissão não encontrado para {FormworkMaterial}.");
}
