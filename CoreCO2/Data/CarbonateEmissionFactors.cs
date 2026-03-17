using CoreCO2.Models;

namespace CoreCO2.Data;

/// <summary>
/// Fatores de emissão de CO₂ para calcinação de carbonatos — Tabela 3 do CT 101.
/// Considerando 100% de calcinação.
/// Fonte: Boletim Técnico IBRACON/ABECE/ABCIC, 1ª Edição, 2024.
/// </summary>
public static class CarbonateEmissionFactors
{
	public static IReadOnlyDictionary<CarbonateType, EmissionFactor> All { get; } =
		new Dictionary<CarbonateType, EmissionFactor>
		{
			[CarbonateType.Calcite] = new("Calcita", 0.44m, 0.44m, "kg CO₂/kg carbonato", "CT101"),
			[CarbonateType.Magnesite] = new("Magnesita", 0.52m, 0.52m, "kg CO₂/kg carbonato", "CT101"),
			[CarbonateType.Dolomite] = new("Dolomita", 0.48m, 0.48m, "kg CO₂/kg carbonato", "CT101"),
			[CarbonateType.Siderite] = new("Siderita", 0.38m, 0.38m, "kg CO₂/kg carbonato", "CT101"),
			[CarbonateType.Ankerite] = new("Ankerita", 0.41m, 0.48m, "kg CO₂/kg carbonato", "CT101"),
			[CarbonateType.Rhodochrosite] = new("Rodocrosita", 0.38m, 0.38m, "kg CO₂/kg carbonato", "CT101"),
			[CarbonateType.SodiumCarbonate] = new("CarbonatoSodio", 0.41m, 0.41m, "kg CO₂/kg carbonato", "CT101"),
		};
}
