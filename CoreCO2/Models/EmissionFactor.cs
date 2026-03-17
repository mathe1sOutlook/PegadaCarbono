namespace CoreCO2.Models;

/// <summary>
/// Fator de emissão de CO₂ para um item do inventário.
/// Suporta faixa de valores (mínimo e máximo) para análise de incerteza.
/// </summary>
/// <param name="ItemId">Identificador do item (ex.: "OleoDiesel", "Calcita").</param>
/// <param name="ValueMin">Fator de emissão mínimo (kg CO₂/unidade).</param>
/// <param name="ValueMax">Fator de emissão máximo (kg CO₂/unidade).</param>
/// <param name="Unit">Unidade do fator (ex.: "kg CO₂/L", "kg CO₂/kg", "kg CO₂/t.km").</param>
/// <param name="Source">Fonte do dado (ex.: "DAP", "Sidac", "CT101").</param>
public record EmissionFactor(
	string ItemId,
	decimal ValueMin,
	decimal ValueMax,
	string Unit,
	string Source)
{
	/// <summary>Valor central do fator de emissão ((min + max) / 2).</summary>
	public decimal ValueCentral => (ValueMin + ValueMax) / 2m;
}
