using app_CO2.Converters;
using app_CO2.Messages;
using app_CO2.Models;
using app_CO2.Services;

namespace app_CO2.ViewModels;

public partial class MaterialTableViewModel(
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

		foreach (ConcreteGrade grade in Enum.GetValues<ConcreteGrade>())
		{
			EmissionFactor factor = MaterialCatalog.ConcreteFactors[grade];
			var row = new FactorRow(
				"Concrete", grade.ToString(), $"Concreto {EnumDisplayHelper.GetDisplayName(grade.ToString())}",
				factor.ValueMin, factor.ValueMax, factor.Unit);

			UserFactorOverride? ov = await userFactorService.GetOverrideAsync("Concrete", grade.ToString());
			if (ov is not null)
			{
				row.Min = ov.FactorMin;
				row.Max = ov.FactorMax;
				row.IsOverridden = true;
			}

			Rows.Add(row);
		}

		foreach (SteelGrade grade in Enum.GetValues<SteelGrade>())
		{
			EmissionFactor factor = MaterialCatalog.SteelFactors[grade];
			var row = new FactorRow(
				"Steel", grade.ToString(), $"Aço {EnumDisplayHelper.GetDisplayName(grade.ToString())}",
				factor.ValueMin, factor.ValueMax, factor.Unit);

			UserFactorOverride? ov = await userFactorService.GetOverrideAsync("Steel", grade.ToString());
			if (ov is not null)
			{
				row.Min = ov.FactorMin;
				row.Max = ov.FactorMax;
				row.IsOverridden = true;
			}

			Rows.Add(row);
		}

		foreach (FormworkMaterial material in Enum.GetValues<FormworkMaterial>())
		{
			EmissionFactor factor = MaterialCatalog.FormworkFactors[material];
			var row = new FactorRow(
				"Formwork", material.ToString(), $"Fôrma {EnumDisplayHelper.GetDisplayName(material.ToString())}",
				factor.ValueMin, factor.ValueMax, factor.Unit);

			UserFactorOverride? ov = await userFactorService.GetOverrideAsync("Formwork", material.ToString());
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
