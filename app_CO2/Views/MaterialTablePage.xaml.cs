using app_CO2.ViewModels;
using mMauiLib.Controls.DataGrid.EventArgs;
using mMauiLib.Controls.DataGrid.Models;

namespace app_CO2.Views;

public partial class MaterialTablePage : ContentPage
{
	private readonly MaterialTableViewModel _vm;

	public MaterialTablePage(MaterialTableViewModel vm)
	{
		InitializeComponent();
		BindingContext = _vm = vm;
	}

	protected override void OnAppearing()
	{
		base.OnAppearing();
		_vm.LoadCommand.Execute(null);
	}

	private void OnCellEditEnding(object? sender, DataGridCellEditEventArgs e)
	{
		if (e.CellContext.RowItem is FactorRow row)
			_vm.SaveOverrideCommand.Execute(row);
	}

	private void OnRestoreClicked(object? sender, System.EventArgs e)
	{
		if (sender is Button { BindingContext: CellContext ctx } && ctx.RowItem is FactorRow row)
			_vm.RestoreDefaultCommand.Execute(row);
	}
}
