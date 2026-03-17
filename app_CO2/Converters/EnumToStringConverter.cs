using System.Globalization;

namespace app_CO2.Converters;

public class EnumToStringConverter : IValueConverter
{
	public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
	{
		string key = value?.ToString() ?? string.Empty;
		return EnumDisplayHelper.GetDisplayName(key);
	}

	public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
		=> throw new NotSupportedException();
}
