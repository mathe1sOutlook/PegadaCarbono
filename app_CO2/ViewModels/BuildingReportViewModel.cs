using app_CO2.Models;
using app_CO2.Services;
using OxyPlot;

namespace app_CO2.ViewModels;

[QueryProperty(nameof(ProjectId), "ProjectId")]
public partial class BuildingReportViewModel(
	IProjectService projectService,
	ICalculatorFacade calculator,
	ICO2ChartService chartService) : ObservableObject
{
	[ObservableProperty]
	private string _projectId = string.Empty;

	[ObservableProperty]
	private BuildingProject? _project;

	[ObservableProperty]
	private BuildingCO2Report? _report;

	[ObservableProperty]
	private bool _isLoading;

	[ObservableProperty]
	private PlotModel? _lifecycleChart;

	[ObservableProperty]
	private PlotModel? _materialPieChart;

	[ObservableProperty]
	private PlotModel? _benchmarkChart;

	[ObservableProperty]
	private PlotModel? _floorEmissionChart;

	partial void OnProjectIdChanged(string value)
	{
		_ = LoadAndCalculateAsync();
	}

	[RelayCommand]
	private async Task LoadAndCalculateAsync()
	{
		if (string.IsNullOrEmpty(ProjectId)) return;
		IsLoading = true;
		try
		{
			Project = await projectService.GetAsync(ProjectId);
			if (Project is not null)
			{
				Report = await calculator.CalculateBuildingAsync(Project);
				if (Report is not null)
				{
					LifecycleChart = chartService.CreateLifecycleBreakdownChart(Report);
					MaterialPieChart = chartService.CreateMaterialPieChart(Report);
					BenchmarkChart = chartService.CreateBenchmarkChart(Report.TotalMaxKgCO2PerM2);
					FloorEmissionChart = chartService.CreateFloorEmissionChart(Report);
				}
			}
		}
		finally { IsLoading = false; }
	}

}
