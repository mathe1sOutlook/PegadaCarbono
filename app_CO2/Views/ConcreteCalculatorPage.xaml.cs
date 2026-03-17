using app_CO2.ViewModels;

namespace app_CO2.Views;

public partial class ConcreteCalculatorPage : ContentPage
{
	public ConcreteCalculatorPage(ConcreteCalculatorViewModel vm)
	{
		InitializeComponent();
		BindingContext = vm;
	}
}
