using app_CO2.Messages;
using app_CO2.Models;
using app_CO2.Services;

namespace app_CO2.ViewModels;

public partial class FormworkCalculatorViewModel(
	ICalculatorFacade calculator,
	IHistoryService historyService,
	HistoryPanelViewModel historyPanel) : ObservableObject
{
	public HistoryPanelViewModel HistoryPanel { get; } = historyPanel;

	[ObservableProperty]
	private string _selectedMaterial = "CompensadoPlastificado";

	[ObservableProperty]
	private decimal _area;

	[ObservableProperty]
	private int _reuses = 12;

	[ObservableProperty]
	private decimal _resultMin;

	[ObservableProperty]
	private decimal _resultMax;

	[ObservableProperty]
	private bool _hasResult;

	public List<string> Materials { get; } = ["CompensadoPlastificado"];

	private CancellationTokenSource? _cts;
	partial void OnSelectedMaterialChanged(string value) => DebounceCalculate();
	partial void OnAreaChanged(decimal value) => DebounceCalculate();
	partial void OnReusesChanged(int value) => DebounceCalculate();
	private async void DebounceCalculate()
	{
		_cts?.Cancel();
		_cts = new CancellationTokenSource();
		try { await Task.Delay(400, _cts.Token); await CalculateAsync(); }
		catch (TaskCanceledException) { }
	}

	[RelayCommand]
	private async Task CalculateAsync()
	{
		if (Area <= 0) return;
		HistoryItem item = calculator.CalculateFormwork(SelectedMaterial, Area, Reuses);
		ResultMin = item.EmissionMin;
		ResultMax = item.EmissionMax;
		HasResult = true;
		await historyService.AddAsync(item);
		WeakReferenceMessenger.Default.Send(new HistoryItemAddedMessage(item));
	}

	[RelayCommand]
	private void Clear()
	{
		Area = 0;
		Reuses = 12;
		ResultMin = 0;
		ResultMax = 0;
		HasResult = false;
	}
}
