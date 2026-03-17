namespace CoreCO2.Models;

/// <summary>
/// Inventário de ciclo de vida consolidado para um produto.
/// Contém todas as entradas, saídas e produtos com seus fatores de emissão.
/// </summary>
public class Inventory
{
	/// <summary>Nome do produto (ex.: "Concreto 25 MPa").</summary>
	public required string ProductName { get; init; }

	/// <summary>Unidade funcional ou declarada (ex.: "1 m³ de concreto").</summary>
	public required string FunctionalUnit { get; init; }

	/// <summary>Itens do inventário (entradas, saídas e produtos).</summary>
	public required IReadOnlyList<InventoryEntry> Entries { get; init; }

	/// <summary>
	/// Fatores de emissão de CO₂ associados aos itens do inventário.
	/// Chave: ItemName do InventoryEntry.
	/// </summary>
	public required IReadOnlyDictionary<string, EmissionFactor> EmissionFactors { get; init; }

	/// <summary>Índice de perdas do processo (ex.: 0.02 para 2%).</summary>
	public decimal LossRatio { get; init; }

	/// <summary>Emissão direta de CO₂ na unidade fabril (ex.: combustão de diesel). Em kg CO₂/UF.</summary>
	public decimal DirectEmission { get; init; }

	/// <summary>Remoção de CO₂ por carbonatação (Eq. 11). Em kg CO₂/UF. Será subtraída do total.</summary>
	public decimal CarbonationRemoval { get; init; }

	/// <summary>Entradas do inventário.</summary>
	public IEnumerable<InventoryEntry> Inputs => Entries.Where(e => e.FlowType == InventoryFlowType.Input);

	/// <summary>Saídas do inventário.</summary>
	public IEnumerable<InventoryEntry> Outputs => Entries.Where(e => e.FlowType == InventoryFlowType.Output);

	/// <summary>Produtos do inventário.</summary>
	public IEnumerable<InventoryEntry> Products => Entries.Where(e => e.FlowType == InventoryFlowType.Product);
}
