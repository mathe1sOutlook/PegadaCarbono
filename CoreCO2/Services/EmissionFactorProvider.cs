using CoreCO2.Abstractions;
using CoreCO2.Data;
using CoreCO2.Models;

namespace CoreCO2.Services;

/// <summary>
/// Provedor de fatores de emissão de CO₂ com dados embutidos do CT 101.
/// </summary>
public sealed class EmissionFactorProvider : IEmissionFactorProvider
{
	public EmissionFactor GetFuelFactor(FuelType fuel)
	{
		if (!FuelEmissionFactors.All.TryGetValue(fuel, out var factor))
			throw new ArgumentException($"Fator de emissão não encontrado para o combustível: {fuel}", nameof(fuel));
		return factor;
	}

	public EmissionFactor GetCarbonateFactor(CarbonateType carbonate)
	{
		if (!CarbonateEmissionFactors.All.TryGetValue(carbonate, out var factor))
			throw new ArgumentException($"Fator de emissão não encontrado para o carbonato: {carbonate}", nameof(carbonate));
		return factor;
	}

	public EmissionFactor GetTransportFactor(TransportMode mode)
	{
		if (!TransportEmissionFactors.All.TryGetValue(mode, out var factor))
			throw new ArgumentException($"Fator de emissão não encontrado para o modo de transporte: {mode}", nameof(mode));
		return factor;
	}

	public EmissionFactor GetElectricityFactor() => ElectricityEmissionFactors.GridPublica;

	public IReadOnlyDictionary<FuelType, EmissionFactor> GetAllFuelFactors() => FuelEmissionFactors.All;

	public IReadOnlyDictionary<CarbonateType, EmissionFactor> GetAllCarbonateFactors() => CarbonateEmissionFactors.All;

	public IReadOnlyDictionary<TransportMode, EmissionFactor> GetAllTransportFactors() => TransportEmissionFactors.All;
}
