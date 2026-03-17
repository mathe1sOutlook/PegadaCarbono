using CoreCO2.Models;

namespace CoreCO2.Abstractions;

/// <summary>
/// Validador de inventário de ciclo de vida conforme CT 101 seção 8.2.
/// </summary>
public interface IInventoryValidator
{
	/// <summary>
	/// Verifica o balanço de massa do inventário (Σ entradas = Σ saídas).
	/// </summary>
	/// <param name="inventory">Inventário a validar.</param>
	/// <param name="tolerancePercent">Tolerância percentual (padrão 1%).</param>
	/// <returns>True se o balanço de massa está dentro da tolerância.</returns>
	bool ValidateMassBalance(Inventory inventory, decimal tolerancePercent = 0.01m);

	/// <summary>
	/// Identifica itens que se enquadram nos critérios de corte (seção 8.2 do CT 101).
	/// Itens com menos de 1% da massa total podem ser omitidos, desde que a soma dos
	/// itens omitidos não exceda 5% da massa total.
	/// </summary>
	/// <param name="inventory">Inventário a analisar.</param>
	/// <returns>Lista de nomes dos itens que podem ser omitidos pelo critério de corte.</returns>
	IReadOnlyList<string> GetCutoffEligibleItems(Inventory inventory);
}
