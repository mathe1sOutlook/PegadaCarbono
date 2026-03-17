using app_CO2.ViewModels;

namespace app_CO2.Views;

public partial class SteelCalculatorPage : ContentPage
{
	public SteelCalculatorPage(SteelCalculatorViewModel vm)
	{
		InitializeComponent();
		BindingContext = vm;
	}
}
