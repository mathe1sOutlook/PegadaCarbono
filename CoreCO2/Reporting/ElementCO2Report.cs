namespace CoreCO2.Reporting;

/// <summary>
/// Relatório de emissão de CO₂ por elemento estrutural.
/// Valores absolutos (kg CO₂), não normalizados por m².
/// </summary>
/// <param name="ElementName">Nome do elemento (ex.: "Pilar P1").</param>
/// <param name="ElementType">Tipo do elemento estrutural.</param>
/// <param name="ConcreteEmissionMin">Emissão do concreto (mínima) em kg CO₂.</param>
/// <param name="ConcreteEmissionMax">Emissão do concreto (máxima) em kg CO₂.</param>
/// <param name="SteelEmissionMin">Emissão do aço (mínima) em kg CO₂.</param>
/// <param name="SteelEmissionMax">Emissão do aço (máxima) em kg CO₂.</param>
/// <param name="FormworkEmissionMin">Emissão da fôrma (mínima) em kg CO₂.</param>
/// <param name="FormworkEmissionMax">Emissão da fôrma (máxima) em kg CO₂.</param>
public record ElementCO2Report(
	string ElementName,
	Building.StructuralElementType ElementType,
	decimal ConcreteEmissionMin,
	decimal ConcreteEmissionMax,
	decimal SteelEmissionMin,
	decimal SteelEmissionMax,
	decimal FormworkEmissionMin,
	decimal FormworkEmissionMax)
{
	/// <summary>Emissão total mínima do elemento (kg CO₂).</summary>
	public decimal TotalMin => ConcreteEmissionMin + SteelEmissionMin + FormworkEmissionMin;

	/// <summary>Emissão total máxima do elemento (kg CO₂).</summary>
	public decimal TotalMax => ConcreteEmissionMax + SteelEmissionMax + FormworkEmissionMax;
}
