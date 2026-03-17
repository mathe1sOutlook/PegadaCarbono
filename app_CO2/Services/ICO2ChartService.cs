using CoreCO2.Reporting;
using OxyPlot;

namespace app_CO2.Services;

public interface ICO2ChartService
{
	PlotModel CreateConcreteGradeChart();
	PlotModel CreateLifecycleBreakdownChart(BuildingCO2Report report);
	PlotModel CreateMaterialPieChart(BuildingCO2Report report);
	PlotModel CreateSensitivityChart();
	PlotModel CreateBenchmarkChart(decimal kgCO2PerM2);
	PlotModel CreateFloorEmissionChart(BuildingCO2Report report);

	// New comparison charts
	PlotModel CreateTransportModeChart();
	PlotModel CreateFuelComparisonChart();
	PlotModel CreateCarbonateComparisonChart();
	PlotModel CreateFormworkComparisonChart();
	PlotModel CreateElectricityContextChart();
}
