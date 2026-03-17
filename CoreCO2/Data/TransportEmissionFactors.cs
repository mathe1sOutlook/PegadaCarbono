using CoreCO2.Models;

namespace CoreCO2.Data;

/// <summary>
/// Fatores de emissão de CO₂ para transporte rodoviário — dados Sidac.
/// Fonte: Boletim Técnico IBRACON/ABECE/ABCIC, 1ª Edição, 2024.
/// </summary>
public static class TransportEmissionFactors
{
	public static IReadOnlyDictionary<TransportMode, EmissionFactor> All { get; } =
		new Dictionary<TransportMode, EmissionFactor>
		{
			[TransportMode.Toco2Eixos] = new("Toco2Eixos", 0.0178m, 0.0178m, "kg CO₂/t.km", "Sidac"),
			[TransportMode.Truck3Eixos] = new("Truck3Eixos", 0.0601m, 0.0601m, "kg CO₂/t.km", "Sidac"),
			[TransportMode.Truck4Eixos] = new("Truck4Eixos", 0.066m, 0.066m, "kg CO₂/t.km", "Sidac"),
			[TransportMode.Carreta5Eixos] = new("Carreta5Eixos", 0.0691m, 0.0691m, "kg CO₂/t.km", "Sidac"),
			[TransportMode.Betoneira] = new("Betoneira", 0.096m, 0.096m, "kg CO₂/t.km", "Sidac"),
		};
}
