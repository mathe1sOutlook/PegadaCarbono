using app_CO2.ViewModels;

namespace app_CO2.Views;

public partial class UnifiedCalculatorPage : ContentPage
{
	public UnifiedCalculatorPage(UnifiedCalculatorViewModel vm)
	{
		InitializeComponent();
		BindingContext = vm;
	}
}
