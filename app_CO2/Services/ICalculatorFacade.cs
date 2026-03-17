using app_CO2.Models;

namespace app_CO2.Services;

public interface ICalculatorFacade
{
	HistoryItem CalculateConcrete(string grade, decimal volumeM3);
	HistoryItem CalculateSteel(string grade, decimal massKg);
	HistoryItem CalculateFormwork(string material, decimal areaM2, int reuses);
	HistoryItem CalculateTransport(string mode, decimal massKg, decimal distanceKm);
	Task<BuildingCO2Report> CalculateBuildingAsync(BuildingProject project);
}
