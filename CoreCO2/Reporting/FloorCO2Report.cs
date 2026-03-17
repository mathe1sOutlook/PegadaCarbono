namespace CoreCO2.Reporting;

/// <summary>
/// Relatório de emissão de CO₂ por pavimento.
/// Valores incluem repetições (RepetitionCount).
/// </summary>
/// <param name="FloorName">Nome do pavimento.</param>
/// <param name="FloorType">Tipo do pavimento.</param>
/// <param name="RepetitionCount">Número de repetições deste pavimento.</param>
/// <param name="AreaM2">Área de um pavimento (sem repetição).</param>
/// <param name="TotalEmissionMin">Emissão total mínima (kg CO₂) — todas as repetições.</param>
/// <param name="TotalEmissionMax">Emissão total máxima (kg CO₂) — todas as repetições.</param>
/// <param name="Elements">Relatórios por elemento (de um pavimento, sem repetição).</param>
public record FloorCO2Report(
	string FloorName,
	Building.FloorType FloorType,
	int RepetitionCount,
	decimal AreaM2,
	decimal TotalEmissionMin,
	decimal TotalEmissionMax,
	IReadOnlyList<ElementCO2Report> Elements)
{
	/// <summary>Emissão por m² do pavimento (mínima), kg CO₂/m².</summary>
	public decimal EmissionPerM2Min => AreaM2 > 0 ? TotalEmissionMin / (AreaM2 * RepetitionCount) : 0m;

	/// <summary>Emissão por m² do pavimento (máxima), kg CO₂/m².</summary>
	public decimal EmissionPerM2Max => AreaM2 > 0 ? TotalEmissionMax / (AreaM2 * RepetitionCount) : 0m;
}
