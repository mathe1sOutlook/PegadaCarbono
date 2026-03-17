namespace CoreCO2.Models;

/// <summary>
/// Dados de entrada para cálculo do estágio A5 (processo construtivo) — Equações 22-29.
/// </summary>
public class ConstructionStageInput
{
	/// <summary>Eletricidade consumida na obra (kWh/UF) — Eq. 23.</summary>
	public decimal ElectricityKwh { get; init; }

	/// <summary>
	/// Combustíveis consumidos na obra — Eq. 24.
	/// Pares (quantidade, fator de emissão). Ex.: (0.12m, 2.29m) para diesel.
	/// </summary>
	public IReadOnlyList<(decimal Quantity, decimal EmissionFactor)> FuelConsumption { get; init; } = [];

	/// <summary>
	/// Materiais desperdiçados na obra — Eq. 26.
	/// Triplas (nome, quantidade desperdiçada em UD/UF, fator A1-A3 em kg CO₂/UD).
	/// A emissão incorporada no desperdício é: qty × fator.
	/// </summary>
	public IReadOnlyList<(string ItemName, decimal WastedQuantity, decimal A1A3Factor)> MaterialLosses { get; init; } = [];

	/// <summary>
	/// Transporte dos materiais desperdiçados até a obra (já foram transportados) — Eq. 27.
	/// </summary>
	public IReadOnlyList<TransportItem> DiscardedMaterialTransport { get; init; } = [];

	/// <summary>
	/// Resíduos gerados na obra com transporte e disposição — Eq. 28-29.
	/// </summary>
	public IReadOnlyList<WasteItem> ConstructionWaste { get; init; } = [];
}
