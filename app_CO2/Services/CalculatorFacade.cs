using app_CO2.Models;
using CoreCO2.Models;

namespace app_CO2.Services;

public class CalculatorFacade(
	ICO2CalculationService calculationService,
	IBuildingCO2Service buildingService,
	IEmissionFactorProvider factorProvider,
	IUserFactorService userFactorService) : ICalculatorFacade
{
	public HistoryItem CalculateConcrete(string grade, decimal volumeM3)
	{
		ConcreteGrade concreteGrade = Enum.Parse<ConcreteGrade>(grade);
		EmissionFactor factor = GetEffectiveFactor("Concrete", grade, MaterialCatalog.ConcreteFactors[concreteGrade]);
		return new HistoryItem
		{
			MaterialType = "Concreto",
			Description = $"{grade} — {volumeM3:N2} m³",
			EmissionMin = factor.ValueMin * volumeM3,
			EmissionMax = factor.ValueMax * volumeM3,
			Unit = "kgCO₂"
		};
	}

	public HistoryItem CalculateSteel(string grade, decimal massKg)
	{
		SteelGrade steelGrade = Enum.Parse<SteelGrade>(grade);
		EmissionFactor factor = GetEffectiveFactor("Steel", grade, MaterialCatalog.SteelFactors[steelGrade]);
		return new HistoryItem
		{
			MaterialType = "Aço",
			Description = $"{grade} — {massKg:N2} kg",
			EmissionMin = factor.ValueMin * massKg,
			EmissionMax = factor.ValueMax * massKg,
			Unit = "kgCO₂"
		};
	}

	public HistoryItem CalculateFormwork(string material, decimal areaM2, int reuses)
	{
		FormworkMaterial fwMaterial = Enum.Parse<FormworkMaterial>(material);
		EmissionFactor factor = GetEffectiveFactor("Formwork", material, MaterialCatalog.FormworkFactors[fwMaterial]);
		decimal effectiveMin = factor.ValueMin / reuses;
		decimal effectiveMax = factor.ValueMax / reuses;
		return new HistoryItem
		{
			MaterialType = "Fôrma",
			Description = $"{material} — {areaM2:N2} m² ({reuses}x)",
			EmissionMin = effectiveMin * areaM2,
			EmissionMax = effectiveMax * areaM2,
			Unit = "kgCO₂"
		};
	}

	public HistoryItem CalculateTransport(string mode, decimal massKg, decimal distanceKm)
	{
		TransportMode transportMode = Enum.Parse<TransportMode>(mode);
		EmissionFactor factor = GetEffectiveFactor("Transport", mode, factorProvider.GetTransportFactor(transportMode));
		decimal massTonnes = massKg / 1000m;
		return new HistoryItem
		{
			MaterialType = "Transporte",
			Description = $"{mode} — {massKg:N0} kg × {distanceKm:N0} km",
			EmissionMin = factor.ValueMin * massTonnes * distanceKm,
			EmissionMax = factor.ValueMax * massTonnes * distanceKm,
			Unit = "kgCO₂"
		};
	}

	public Task<BuildingCO2Report> CalculateBuildingAsync(BuildingProject project)
	{
		Building building = project.ToBuilding();
		BuildingCO2Report report = buildingService.Calculate(building);
		return Task.FromResult(report);
	}

	private EmissionFactor GetEffectiveFactor(string category, string key, EmissionFactor defaultFactor)
	{
		UserFactorOverride? ov = userFactorService.GetOverrideAsync(category, key).GetAwaiter().GetResult();
		if (ov is null)
			return defaultFactor;

		return new EmissionFactor(defaultFactor.ItemId, ov.FactorMin, ov.FactorMax, defaultFactor.Unit, "Personalizado");
	}
}
