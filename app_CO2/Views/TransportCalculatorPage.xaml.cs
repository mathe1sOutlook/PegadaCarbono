using app_CO2.ViewModels;

namespace app_CO2.Views;

public partial class TransportCalculatorPage : ContentPage
{
	public TransportCalculatorPage(TransportCalculatorViewModel vm)
	{
		InitializeComponent();
		BindingContext = vm;
	}
}
