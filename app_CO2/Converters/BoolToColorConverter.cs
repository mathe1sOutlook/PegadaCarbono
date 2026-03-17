using System.Globalization;

namespace app_CO2.Converters;

public class BoolToColorConverter : IValueConverter
{
	public Color TrueColor { get; set; } = Colors.Orange;
	public Color FalseColor { get; set; } = Colors.Transparent;

	public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
		=> value is true ? TrueColor : FalseColor;

	public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
		=> throw new NotSupportedException();
}
