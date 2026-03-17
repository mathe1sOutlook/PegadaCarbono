using app_CO2.ViewModels;
using mMauiLib.Controls.DataGrid.Selectors;

namespace app_CO2.Views.Selectors;

public class OverrideRowStyleSelector : RowStyleSelector
{
	private static readonly Color OverrideColor = Color.FromArgb("#FFF9C4");

	public override Color? SelectBackground(object item, int rowIndex)
		=> item is FactorRow { IsOverridden: true } ? OverrideColor : null;
}
