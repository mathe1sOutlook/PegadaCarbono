using app_CO2.Models;
using app_CO2.Services;
using OxyPlot;

namespace app_CO2.ViewModels;

public partial class DashboardViewModel(
	HistoryPanelViewModel historyPanel,
	IProjectService projectService,
	ICO2ChartService chartService) : ObservableObject
{
	public HistoryPanelViewModel HistoryPanel { get; } = historyPanel;

	[ObservableProperty]
	private int _totalCalculations;

	[ObservableProperty]
	private int _totalProjects;

	// Charts — one per row (full width, stacked vertically)
	public PlotModel ConcreteGradeChart { get; } = chartService.CreateConcreteGradeChart();
	public PlotModel SensitivityChart { get; } = chartService.CreateSensitivityChart();
	public PlotModel TransportModeChart { get; } = chartService.CreateTransportModeChart();
	public PlotModel FormworkComparisonChart { get; } = chartService.CreateFormworkComparisonChart();
	public PlotModel FuelComparisonChart { get; } = chartService.CreateFuelComparisonChart();
	public PlotModel CarbonateComparisonChart { get; } = chartService.CreateCarbonateComparisonChart();
	public PlotModel ElectricityContextChart { get; } = chartService.CreateElectricityContextChart();

	[RelayCommand]
	private async Task LoadAsync()
	{
		TotalCalculations = HistoryPanel.Items.Count;
		List<BuildingProject> projects = await projectService.ListAsync();
		TotalProjects = projects.Count;
	}

}
