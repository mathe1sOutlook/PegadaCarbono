using app_CO2.ViewModels;

namespace app_CO2.Views;

public partial class DashboardPage : ContentPage
{
	private readonly DashboardViewModel _vm;
	private readonly UnifiedCalculatorViewModel _calcVm;

	public DashboardPage(DashboardViewModel vm, UnifiedCalculatorViewModel calcVm)
	{
		InitializeComponent();
		BindingContext = _vm = vm;
		_calcVm = calcVm;
	}

	protected override void OnAppearing()
	{
		base.OnAppearing();
		_vm.LoadCommand.Execute(null);
	}

	private async void OnConcreteCardTapped(object? sender, TappedEventArgs e)
	{
		_calcVm.SelectedTab = 0;
		await Shell.Current.GoToAsync("//calculators");
	}

	private async void OnSteelCardTapped(object? sender, TappedEventArgs e)
	{
		_calcVm.SelectedTab = 1;
		await Shell.Current.GoToAsync("//calculators");
	}

	private async void OnFormworkCardTapped(object? sender, TappedEventArgs e)
	{
		_calcVm.SelectedTab = 2;
		await Shell.Current.GoToAsync("//calculators");
	}

	private async void OnTransportCardTapped(object? sender, TappedEventArgs e)
	{
		_calcVm.SelectedTab = 3;
		await Shell.Current.GoToAsync("//calculators");
	}

	private async void OnBuildingCardTapped(object? sender, TappedEventArgs e)
		=> await Shell.Current.GoToAsync("//building");
}
