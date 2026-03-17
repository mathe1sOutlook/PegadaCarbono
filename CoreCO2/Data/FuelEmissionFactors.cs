using CoreCO2.Models;

namespace CoreCO2.Data;

/// <summary>
/// Fatores de emissão de CO₂ para combustíveis fósseis — Tabela 2 do CT 101.
/// Fonte: Boletim Técnico IBRACON/ABECE/ABCIC, 1ª Edição, 2024.
/// </summary>
public static class FuelEmissionFactors
{
	public static IReadOnlyDictionary<FuelType, EmissionFactor> All { get; } =
		new Dictionary<FuelType, EmissionFactor>
		{
			[FuelType.AlcoolEtilicoHidratado] = new("AlcoolEtilicoHidratado", 0m, 0m, "kg CO₂/L", "CT101"),
			[FuelType.CarvaoMineral] = new("CarvaoMineral", 2.28m, 2.28m, "kg CO₂/kg", "CT101"),
			[FuelType.CarvaoVegetalNaoRenovavel] = new("CarvaoVegetalNaoRenovavel", 3.03m, 3.03m, "kg CO₂/kg", "CT101"),
			[FuelType.CarvaoVegetalRenovavel] = new("CarvaoVegetalRenovavel", 0m, 0m, "kg CO₂/kg", "CT101"),
			[FuelType.CoqueCarvaoMineral] = new("CoqueCarvaoMineral", 2.73m, 2.73m, "kg CO₂/kg", "CT101"),
			[FuelType.CoquePetroleo] = new("CoquePetroleo", 3.42m, 3.42m, "kg CO₂/kg", "CT101"),
			[FuelType.GLP] = new("GLP", 2.93m, 2.93m, "kg CO₂/kg", "CT101"),
			[FuelType.GasNatural] = new("GasNatural", 2.74m, 2.74m, "kg CO₂/m³", "CT101"),
			[FuelType.GasolinaAutomotiva] = new("GasolinaAutomotiva", 1.61m, 1.61m, "kg CO₂/L", "CT101"),
			[FuelType.LenhaNaoRenovavel] = new("LenhaNaoRenovavel", 366m, 366m, "kg CO₂/st", "CT101"),
			[FuelType.LenhaRenovavel] = new("LenhaRenovavel", 0m, 0m, "kg CO₂/st", "CT101"),
			[FuelType.OleoCombustivel] = new("OleoCombustivel", 3.11m, 3.11m, "kg CO₂/L", "CT101"),
			[FuelType.OleoDiesel] = new("OleoDiesel", 2.29m, 2.29m, "kg CO₂/L", "CT101"),
			[FuelType.ResiduosMadeiraRenovavel] = new("ResiduosMadeiraRenovavel", 0m, 0m, "kg CO₂/kg", "CT101"),
			[FuelType.ResiduosOleo] = new("ResiduosOleo", 3.11m, 3.11m, "kg CO₂/kg", "CT101"),
			[FuelType.ResiduoPneu] = new("ResiduoPneu", 3.14m, 3.14m, "kg CO₂/kg", "CT101"),
			[FuelType.ResiduoPlastico] = new("ResiduoPlastico", 1.98m, 1.98m, "kg CO₂/kg", "CT101"),
		};
}
