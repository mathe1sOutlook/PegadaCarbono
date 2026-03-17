using CoreCO2.Models;

namespace CoreCO2.Materials;

/// <summary>
/// Configuração de transporte padrão para um material.
/// </summary>
/// <param name="Mode">Modo de transporte rodoviário.</param>
/// <param name="DistanceKm">Distância de transporte ida e volta (km).</param>
/// <param name="EmissionFactorPerTonKm">Fator de emissão (kg CO₂/t.km).</param>
public record TransportConfig(
	TransportMode Mode,
	decimal DistanceKm,
	decimal EmissionFactorPerTonKm);
