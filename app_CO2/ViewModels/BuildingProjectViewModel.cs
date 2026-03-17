using app_CO2.Models;
using app_CO2.Services;

namespace app_CO2.ViewModels;

public partial class BuildingProjectViewModel(
	IProjectService projectService,
	ICalculatorFacade calculator) : ObservableObject
{
	[ObservableProperty]
	private BuildingProject _currentProject = new();

	[ObservableProperty]
	private BuildingFloorViewModel? _selectedFloor;

	public ObservableCollection<BuildingProject> Projects { get; } = [];
	public ObservableCollection<BuildingFloorViewModel> Floors { get; } = [];

	[RelayCommand]
	private async Task LoadProjectsAsync()
	{
		List<BuildingProject> projects = await projectService.ListAsync();
		Projects.Clear();
		foreach (BuildingProject p in projects) Projects.Add(p);
	}

	[RelayCommand]
	private async Task LoadProjectAsync(BuildingProject project)
	{
		CurrentProject = project;
		SyncFloorsFromProject();
		await Task.CompletedTask;
	}

	[RelayCommand]
	private async Task SaveProjectAsync()
	{
		SyncFloorsToProject();
		await projectService.SaveAsync(CurrentProject);
		await LoadProjectsAsync();
	}

	[RelayCommand]
	private void NewProject()
	{
		CurrentProject = new BuildingProject();
		Floors.Clear();
		SelectedFloor = null;
	}

	[RelayCommand]
	private async Task DeleteProjectAsync(BuildingProject project)
	{
		await projectService.DeleteAsync(project.Id);
		if (CurrentProject.Id == project.Id) NewProject();
		await LoadProjectsAsync();
	}

	// Floor management
	[RelayCommand]
	private void AddFloor()
	{
		var floor = new BuildingFloorViewModel
		{
			Name = $"Pavimento {Floors.Count + 1}",
			FloorArea = 500m
		};
		Floors.Add(floor);
		SelectedFloor = floor;
	}

	[RelayCommand]
	private void RemoveFloor(BuildingFloorViewModel floor)
	{
		Floors.Remove(floor);
		if (SelectedFloor == floor)
			SelectedFloor = Floors.LastOrDefault();
	}

	// Calculate
	[RelayCommand]
	private async Task CalculateAsync()
	{
		SyncFloorsToProject();
		await projectService.SaveAsync(CurrentProject);
		await Shell.Current.GoToAsync("building-report", new Dictionary<string, object>
		{
			["ProjectId"] = CurrentProject.Id
		});
	}

	private void SyncFloorsToProject()
	{
		CurrentProject.Floors = Floors.Select(f => f.ToDto()).ToList();
	}

	private void SyncFloorsFromProject()
	{
		Floors.Clear();
		foreach (var dto in CurrentProject.Floors)
			Floors.Add(BuildingFloorViewModel.FromDto(dto));
		SelectedFloor = Floors.FirstOrDefault();
	}
}
