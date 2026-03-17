using app_CO2.Models;

namespace app_CO2.ViewModels;

public partial class BuildingFloorViewModel : ObservableObject
{
	[ObservableProperty]
	private string _name = string.Empty;

	[ObservableProperty]
	private string _floorType = "TypicalFloor";

	[ObservableProperty]
	private decimal _floorHeight = 3.0m;

	[ObservableProperty]
	private decimal _floorArea;

	[ObservableProperty]
	private int _repetitionCount = 1;

	public ObservableCollection<BuildingElementViewModel> Elements { get; } = [];

	public List<string> FloorTypes { get; } =
	[
		"Foundation", "Infrastructure", "GroundFloor", "TypicalFloor",
		"Roof", "Attic", "UpperReservoir", "LowerReservoir"
	];

	[RelayCommand]
	private void AddElement()
	{
		Elements.Add(new BuildingElementViewModel
		{
			Name = $"Elemento {Elements.Count + 1}"
		});
	}

	[RelayCommand]
	private void RemoveElement(BuildingElementViewModel element)
	{
		Elements.Remove(element);
	}

	public BuildingFloorDto ToDto() => new()
	{
		Name = Name,
		FloorType = FloorType,
		FloorHeight = FloorHeight,
		FloorArea = FloorArea,
		RepetitionCount = RepetitionCount,
		Elements = Elements.Select(e => e.ToDto()).ToList()
	};

	public static BuildingFloorViewModel FromDto(BuildingFloorDto dto)
	{
		var vm = new BuildingFloorViewModel
		{
			Name = dto.Name,
			FloorType = dto.FloorType,
			FloorHeight = dto.FloorHeight,
			FloorArea = dto.FloorArea,
			RepetitionCount = dto.RepetitionCount
		};
		foreach (var e in dto.Elements)
			vm.Elements.Add(BuildingElementViewModel.FromDto(e));
		return vm;
	}
}
