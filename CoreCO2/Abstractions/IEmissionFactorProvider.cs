using CoreCO2.Models;

namespace CoreCO2.Abstractions;

/// <summary>
/// Provedor de fatores de emissão de CO₂.
/// Fornece acesso aos dados de referência do CT 101 (Tabelas 2, 3 e fatores de transporte/eletricidade).
/// </summary>
public interface IEmissionFactorProvider
{
	/// <summary>Obtém o fator de emissão para um combustível fóssil.</summary>
	EmissionFactor GetFuelFactor(FuelType fuel);

	/// <summary>Obtém o fator de emissão para calcinação de um carbonato.</summary>
	EmissionFactor GetCarbonateFactor(CarbonateType carbonate);

	/// <summary>Obtém o fator de emissão para um modo de transporte.</summary>
	EmissionFactor GetTransportFactor(TransportMode mode);

	/// <summary>Obtém o fator de emissão da rede elétrica.</summary>
	EmissionFactor GetElectricityFactor();

	/// <summary>Retorna todos os fatores de combustíveis fósseis.</summary>
	IReadOnlyDictionary<FuelType, EmissionFactor> GetAllFuelFactors();

	/// <summary>Retorna todos os fatores de carbonatos.</summary>
	IReadOnlyDictionary<CarbonateType, EmissionFactor> GetAllCarbonateFactors();

	/// <summary>Retorna todos os fatores de transporte.</summary>
	IReadOnlyDictionary<TransportMode, EmissionFactor> GetAllTransportFactors();
}
