using app_CO2.Messages;
using app_CO2.Models;
using app_CO2.Services;

namespace app_CO2.ViewModels;

public partial class TransportCalculatorViewModel(
	ICalculatorFacade calculator,
	IHistoryService historyService,
	HistoryPanelViewModel historyPanel) : ObservableObject
{
	public HistoryPanelViewModel HistoryPanel { get; } = historyPanel;

	[ObservableProperty]
	private string _selectedMode = "Toco2Eixos";

	[ObservableProperty]
	private decimal _mass;

	[ObservableProperty]
	private decimal _distance;

	[ObservableProperty]
	private decimal _resultMin;

	[ObservableProperty]
	private decimal _resultMax;

	[ObservableProperty]
	private bool _hasResult;

	public List<string> Modes { get; } = ["Toco2Eixos", "Truck3Eixos", "Truck4Eixos", "Carreta5Eixos", "Betoneira"];

	private CancellationTokenSource? _cts;
	partial void OnSelectedModeChanged(string value) => DebounceCalculate();
	partial void OnMassChanged(decimal value) => DebounceCalculate();
	partial void OnDistanceChanged(decimal value) => DebounceCalculate();
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
		if (Mass <= 0 || Distance <= 0) return;
		HistoryItem item = calculator.CalculateTransport(SelectedMode, Mass, Distance);
		ResultMin = item.EmissionMin;
		ResultMax = item.EmissionMax;
		HasResult = true;
		await historyService.AddAsync(item);
		WeakReferenceMessenger.Default.Send(new HistoryItemAddedMessage(item));
	}

	[RelayCommand]
	private void Clear()
	{
		Mass = 0;
		Distance = 0;
		ResultMin = 0;
		ResultMax = 0;
		HasResult = false;
	}
}
