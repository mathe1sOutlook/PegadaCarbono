namespace CoreCO2.Building;

/// <summary>
/// Parâmetros do estágio A5 (processo construtivo) para o edifício.
/// Valores default baseados nos exemplos do CT 101.
/// </summary>
/// <param name="ConcreteLossPercent">Índice de perdas de concreto (%). Default 5% (CT 101 seção 12.2).</param>
/// <param name="SteelLossPercent">Índice de perdas de aço (%). Default 1%.</param>
/// <param name="FormworkLossPercent">Índice de perdas de fôrma (%). Default 0%.</param>
/// <param name="DieselPerM3Concrete">Consumo de diesel na obra (L/m³ de concreto). Default 0.5 L/m³.</param>
/// <param name="ElectricityPerM3Concrete">Consumo de eletricidade na obra (kWh/m³ de concreto). Default 0.</param>
/// <param name="WasteDisposalEmissionFactor">Fator de emissão para disposição de resíduos (kg CO₂/kg). Default 0.0116 (CT 101, Eq.19 — aterro classe A).</param>
public record ConstructionConfig(
	decimal ConcreteLossPercent = 5m,
	decimal SteelLossPercent = 1m,
	decimal FormworkLossPercent = 0m,
	decimal DieselPerM3Concrete = 0.5m,
	decimal ElectricityPerM3Concrete = 0m,
	decimal WasteDisposalEmissionFactor = 0.0116m)
{
	/// <summary>Índice de perdas de concreto como fração (ex.: 0.05 para 5%).</summary>
	public decimal ConcreteLossFraction => ConcreteLossPercent / 100m;

	/// <summary>Índice de perdas de aço como fração (ex.: 0.01 para 1%).</summary>
	public decimal SteelLossFraction => SteelLossPercent / 100m;

	/// <summary>Índice de perdas de fôrma como fração.</summary>
	public decimal FormworkLossFraction => FormworkLossPercent / 100m;
}
