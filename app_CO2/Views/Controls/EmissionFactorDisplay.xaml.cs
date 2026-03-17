namespace app_CO2.Views.Controls;

public partial class EmissionFactorDisplay : ContentView
{
	public static readonly BindableProperty FactorNameProperty =
		BindableProperty.Create(nameof(FactorName), typeof(string), typeof(EmissionFactorDisplay), string.Empty, propertyChanged: OnPropertyChanged);

	public static readonly BindableProperty MinValueProperty =
		BindableProperty.Create(nameof(MinValue), typeof(decimal), typeof(EmissionFactorDisplay), 0m, propertyChanged: OnPropertyChanged);

	public static readonly BindableProperty MaxValueProperty =
		BindableProperty.Create(nameof(MaxValue), typeof(decimal), typeof(EmissionFactorDisplay), 0m, propertyChanged: OnPropertyChanged);

	public static readonly BindableProperty UnitTextProperty =
		BindableProperty.Create(nameof(UnitText), typeof(string), typeof(EmissionFactorDisplay), string.Empty, propertyChanged: OnPropertyChanged);

	public static readonly BindableProperty SourceTextProperty =
		BindableProperty.Create(nameof(SourceText), typeof(string), typeof(EmissionFactorDisplay), string.Empty, propertyChanged: OnPropertyChanged);

	public string FactorName { get => (string)GetValue(FactorNameProperty); set => SetValue(FactorNameProperty, value); }
	public decimal MinValue { get => (decimal)GetValue(MinValueProperty); set => SetValue(MinValueProperty, value); }
	public decimal MaxValue { get => (decimal)GetValue(MaxValueProperty); set => SetValue(MaxValueProperty, value); }
	public string UnitText { get => (string)GetValue(UnitTextProperty); set => SetValue(UnitTextProperty, value); }
	public string SourceText { get => (string)GetValue(SourceTextProperty); set => SetValue(SourceTextProperty, value); }

	public EmissionFactorDisplay()
	{
		InitializeComponent();
	}

	private static void OnPropertyChanged(BindableObject bindable, object oldValue, object newValue)
	{
		if (bindable is EmissionFactorDisplay display)
			display.UpdateDisplay();
	}

	private void UpdateDisplay()
	{
		FactorNameLabel.Text = FactorName;
		MinSpan.Text = MinValue.ToString("N4");
		MaxSpan.Text = MaxValue.ToString("N4");
		UnitSpan.Text = UnitText;
		SourceLabel.Text = SourceText;
	}
}
