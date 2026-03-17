using System.Globalization;

namespace app_CO2.Converters;

public class DecimalFormatConverter : IValueConverter
{
	public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
	{
		if (value is decimal d)
		{
			string format = parameter as string ?? "N2";
			return d.ToString(format, CultureInfo.InvariantCulture);
		}
		return value?.ToString();
	}

	public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
	{
		if (value is string s && decimal.TryParse(s, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal result))
			return result;
		return 0m;
	}
}
