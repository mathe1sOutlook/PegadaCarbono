using app_CO2.ViewModels;

namespace app_CO2.Views;

public partial class FormworkCalculatorPage : ContentPage
{
	public FormworkCalculatorPage(FormworkCalculatorViewModel vm)
	{
		InitializeComponent();
		BindingContext = vm;
	}
}
