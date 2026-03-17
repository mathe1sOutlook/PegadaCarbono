using CoreCO2.Models;

namespace CoreCO2.Data;

/// <summary>
/// Fatores de emissão de CO₂ para energia elétrica — dados Sidac.
/// Fonte: Boletim Técnico IBRACON/ABECE/ABCIC, 1ª Edição, 2024.
/// </summary>
public static class ElectricityEmissionFactors
{
	/// <summary>
	/// Fator de emissão de CO₂ da rede pública brasileira (kg CO₂/kWh).
	/// </summary>
	public static EmissionFactor GridPublica { get; } =
		new("RedePublica", 0.07m, 0.07m, "kg CO₂/kWh", "Sidac");
}
