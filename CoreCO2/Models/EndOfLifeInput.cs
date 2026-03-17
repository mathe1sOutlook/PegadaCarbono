namespace CoreCO2.Models;

/// <summary>
/// Dados de entrada para cálculo do estágio C1-C4 (fim de vida) — Equações 35-40.
/// </summary>
public class EndOfLifeInput
{
	/// <summary>Eletricidade consumida na demolição (kWh/UF) — Eq. 36.</summary>
	public decimal DemolitionElectricityKwh { get; init; }

	/// <summary>
	/// Combustíveis consumidos na demolição — Eq. 37.
	/// Pares (quantidade, fator de emissão).
	/// </summary>
	public IReadOnlyList<(decimal Quantity, decimal EmissionFactor)> DemolitionFuel { get; init; } = [];

	/// <summary>
	/// Resíduos da demolição com transporte e disposição — Eq. 38-40.
	/// O DisposalEmissionFactor do WasteItem cobre C3 (reciclagem) + C4 (disposição final).
	/// </summary>
	public IReadOnlyList<WasteItem> DemolitionWaste { get; init; } = [];
}
