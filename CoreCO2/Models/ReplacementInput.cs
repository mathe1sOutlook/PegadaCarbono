namespace CoreCO2.Models;

/// <summary>
/// Dados de entrada para cálculo do estágio B4 (substituições) — Equações 30-34.
/// </summary>
public class ReplacementInput
{
	/// <summary>Período de referência da edificação em anos (ex.: 50).</summary>
	public required int ReferencePeriodYears { get; init; }

	/// <summary>
	/// Materiais a substituir durante a vida útil.
	/// Cada item contém: nome, vida útil do material, quantidade por substituição,
	/// fator A1-A3, e dados de transporte/resíduo.
	/// </summary>
	public required IReadOnlyList<ReplacementMaterial> Materials { get; init; }
}

/// <summary>
/// Material que será substituído durante a vida útil da edificação.
/// </summary>
/// <param name="ItemName">Nome do material (ex.: "Telha cerâmica").</param>
/// <param name="MaterialLifeYears">Vida útil do material em anos.</param>
/// <param name="QuantityPerReplacement">Quantidade por substituição (UD/UF), incluindo perdas.</param>
/// <param name="A1A3Factor">Fator de emissão A1-A3 do material (kg CO₂/UD).</param>
/// <param name="TransportToSite">Transporte do material de reposição até a obra (pode ser null).</param>
/// <param name="Waste">Resíduo gerado pela remoção do material antigo (pode ser null).</param>
public record ReplacementMaterial(
	string ItemName,
	int MaterialLifeYears,
	decimal QuantityPerReplacement,
	decimal A1A3Factor,
	TransportItem? TransportToSite = null,
	WasteItem? Waste = null);
