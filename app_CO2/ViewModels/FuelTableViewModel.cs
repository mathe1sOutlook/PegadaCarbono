using app_CO2.Converters;
using app_CO2.Messages;
using app_CO2.Models;
using app_CO2.Services;

namespace app_CO2.ViewModels;

public partial class FuelTableViewModel(
	IEmissionFactorProvider factorProvider,
	IUserFactorService userFactorService) : ObservableObject
{
	public ObservableCollection<FactorRow> Rows { get; } = [];

	[ObservableProperty]
	private bool _hasAnyOverride;

	[RelayCommand]
	private async Task LoadAsync()
	{
		Rows.Clear();
		foreach (FuelType fuel in Enum.GetValues<FuelType>())
		{
			EmissionFactor factor = factorProvider.GetFuelFactor(fuel);
			var row = new FactorRow(
				"Fuel", fuel.ToString(), EnumDisplayHelper.GetDisplayName(fuel.ToString()),
				factor.ValueMin, factor.ValueMax, factor.Unit);

			UserFactorOverride? ov = await userFactorService.GetOverrideAsync("Fuel", fuel.ToString());
			if (ov is not null)
			{
				row.Min = ov.FactorMin;
				row.Max = ov.FactorMax;
				row.IsOverridden = true;
			}

			Rows.Add(row);
		}
		HasAnyOverride = Rows.Any(r => r.IsOverridden);
	}

	[RelayCommand]
	private async Task SaveOverrideAsync(FactorRow row)
	{
		var ov = new UserFactorOverride(
			row.Category, row.Key, row.Min, row.Max, row.Unit, DateTime.UtcNow);
		await userFactorService.SaveOverrideAsync(ov);
		row.IsOverridden = true;
		HasAnyOverride = true;
		WeakReferenceMessenger.Default.Send(new FactorOverrideChangedMessage(ov));
	}

	[RelayCommand]
	private async Task RestoreDefaultAsync(FactorRow row)
	{
		await userFactorService.RemoveOverrideAsync(row.Category, row.Key);
		row.Min = row.DefaultMin;
		row.Max = row.DefaultMax;
		row.IsOverridden = false;
		HasAnyOverride = Rows.Any(r => r.IsOverridden);
	}

	[RelayCommand]
	private async Task RestoreAllDefaultsAsync()
	{
		foreach (FactorRow row in Rows)
		{
			if (!row.IsOverridden) continue;
			await userFactorService.RemoveOverrideAsync(row.Category, row.Key);
			row.Min = row.DefaultMin;
			row.Max = row.DefaultMax;
			row.IsOverridden = false;
		}
		HasAnyOverride = false;
	}
}

public partial class FactorRow(
	string category, string key, string name,
	decimal defaultMin, decimal defaultMax, string unit) : ObservableObject
{
	public string Category { get; } = category;
	public string Key { get; } = key;
	public string Name { get; } = name;
	public decimal DefaultMin { get; } = defaultMin;
	public decimal DefaultMax { get; } = defaultMax;
	public string Unit { get; } = unit;

	[ObservableProperty]
	private decimal _min = defaultMin;

	[ObservableProperty]
	private decimal _max = defaultMax;

	[ObservableProperty]
	private bool _isOverridden;
}
