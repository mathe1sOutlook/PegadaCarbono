using app_CO2.ViewModels;

namespace app_CO2.Views;

public partial class BuildingReportPage : ContentPage
{
	public BuildingReportPage(BuildingReportViewModel vm)
	{
		Resources.Add("InvertBoolConverter", new InvertBoolConverter());
		Resources.Add("IsNotNullConverter", new IsNotNullConverter());
		InitializeComponent();
		BindingContext = vm;
	}

	private async void OnBackClicked(object? sender, EventArgs e)
		=> await Shell.Current.GoToAsync("..");
}

public class InvertBoolConverter : IValueConverter
{
	public object? Convert(object? value, Type targetType, object? parameter, System.Globalization.CultureInfo culture)
		=> value is bool b ? !b : value;

	public object? ConvertBack(object? value, Type targetType, object? parameter, System.Globalization.CultureInfo culture)
		=> value is bool b ? !b : value;
}

public class IsNotNullConverter : IValueConverter
{
	public object Convert(object? value, Type targetType, object? parameter, System.Globalization.CultureInfo culture)
		=> value is not null;

	public object ConvertBack(object? value, Type targetType, object? parameter, System.Globalization.CultureInfo culture)
		=> throw new NotSupportedException();
}
