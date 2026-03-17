using app_CO2.ViewModels;

namespace app_CO2.Views;

public partial class BuildingProjectPage : ContentPage
{
	private readonly BuildingProjectViewModel _vm;

	public BuildingProjectPage(BuildingProjectViewModel vm)
	{
		InitializeComponent();
		BindingContext = _vm = vm;
	}

	protected override void OnAppearing()
	{
		base.OnAppearing();
		_vm.LoadProjectsCommand.Execute(null);
	}
}
