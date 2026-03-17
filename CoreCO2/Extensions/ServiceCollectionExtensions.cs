using CoreCO2.Abstractions;
using CoreCO2.Building;
using CoreCO2.Building.Translation;
using CoreCO2.Optimization;
using CoreCO2.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace CoreCO2.Extensions;

/// <summary>
/// Extensões para registro dos serviços CoreCO2 no contêiner de DI.
/// </summary>
public static class ServiceCollectionExtensions
{
	/// <summary>
	/// Adiciona os serviços de cálculo de emissões de CO₂ ao contêiner de DI.
	/// Inclui o motor de cálculo CT 101 e os serviços de edificação.
	/// </summary>
	/// <param name="services">Coleção de serviços.</param>
	/// <returns>A coleção de serviços para encadeamento.</returns>
	public static IServiceCollection AddCoreCO2(this IServiceCollection services)
	{
		if (services is null)
			throw new ArgumentNullException(nameof(services));

		// Motor de cálculo CT 101 (existente)
		services.TryAddSingleton<IEmissionFactorProvider, EmissionFactorProvider>();
		services.TryAddSingleton<IInventoryValidator, InventoryValidator>();
		services.TryAddSingleton<ICO2CalculationService, CO2CalculationService>();

		// Camada de edificação
		services.TryAddSingleton<IBuildingInventoryTranslator, BuildingInventoryTranslator>();
		services.TryAddSingleton<IBuildingCO2Service, BuildingCO2Service>();
		services.TryAddSingleton<IBuildingComparisonService, BuildingComparisonService>();

		return services;
	}
}
