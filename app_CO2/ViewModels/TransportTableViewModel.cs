using app_CO2.Converters;
using app_CO2.Messages;
using app_CO2.Models;
using app_CO2.Services;

namespace app_CO2.ViewModels;

public partial class TransportTableViewModel(
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
		foreach (TransportMode mode in Enum.GetValues<TransportMode>())
		{
			EmissionFactor factor = factorProvider.GetTransportFactor(mode);
			var row = new FactorRow(
				"Transport", mode.ToString(), EnumDisplayHelper.GetDisplayName(mode.ToString()),
				factor.ValueMin, factor.ValueMax, factor.Unit);

			UserFactorOverride? ov = await userFactorService.GetOverrideAsync("Transport", mode.ToString());
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
