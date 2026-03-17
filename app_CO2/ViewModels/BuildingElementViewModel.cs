using app_CO2.Models;

namespace app_CO2.ViewModels;

public partial class BuildingElementViewModel : ObservableObject
{
	[ObservableProperty]
	private string _name = string.Empty;

	[ObservableProperty]
	private string _elementType = "Pilar";

	[ObservableProperty]
	private decimal _concreteVolume;

	[ObservableProperty]
	private string _concreteGrade = "C30";

	[ObservableProperty]
	private decimal _steelMass;

	[ObservableProperty]
	private string _steelGrade = "CA50";

	[ObservableProperty]
	private decimal _formworkArea;

	[ObservableProperty]
	private string _formworkMaterial = "CompensadoPlastificado";

	[ObservableProperty]
	private int _formworkReuses = 12;

	public List<string> ElementTypes { get; } =
	[
		"Pilar", "Viga", "Laje", "Sapata",
		"BlocoFundacao", "Tubulao", "Estaca", "Radier"
	];

	public List<string> ConcreteGrades { get; } = ["C20", "C25", "C30", "C35", "C40", "C45", "C50"];
	public List<string> SteelGrades { get; } = ["CA50", "CA60"];
	public List<string> FormworkMaterials { get; } = ["CompensadoPlastificado", "MadeiraSerradaBruta", "Metalica"];

	public BuildingElementDto ToDto() => new()
	{
		Name = Name,
		ElementType = ElementType,
		ConcreteVolume = ConcreteVolume,
		ConcreteGrade = ConcreteGrade,
		SteelMass = SteelMass,
		SteelGrade = SteelGrade,
		FormworkArea = FormworkArea,
		FormworkMaterial = FormworkMaterial,
		FormworkReuses = FormworkReuses
	};

	public static BuildingElementViewModel FromDto(BuildingElementDto dto) => new()
	{
		Name = dto.Name,
		ElementType = dto.ElementType,
		ConcreteVolume = dto.ConcreteVolume,
		ConcreteGrade = dto.ConcreteGrade,
		SteelMass = dto.SteelMass,
		SteelGrade = dto.SteelGrade,
		FormworkArea = dto.FormworkArea,
		FormworkMaterial = dto.FormworkMaterial,
		FormworkReuses = dto.FormworkReuses
	};
}
