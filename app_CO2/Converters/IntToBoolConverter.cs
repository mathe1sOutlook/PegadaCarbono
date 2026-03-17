using System.Globalization;

namespace app_CO2.Converters;

public class IntToBoolConverter : IValueConverter
{
	public object Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
	{
		if (value is int intVal && parameter is string paramStr && int.TryParse(paramStr, out int target))
			return intVal == target;
		return false;
	}

	public object ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
		=> throw new NotSupportedException();
}
