using app_CO2.Messages;
using app_CO2.Models;
using app_CO2.Services;

namespace app_CO2.ViewModels;

public partial class ConcreteCalculatorViewModel(
	ICalculatorFacade calculator,
	IHistoryService historyService,
	HistoryPanelViewModel historyPanel) : ObservableObject
{
	public HistoryPanelViewModel HistoryPanel { get; } = historyPanel;

	[ObservableProperty]
	private string _selectedGrade = "C30";

	[ObservableProperty]
	private decimal _volume;

	[ObservableProperty]
	private decimal _resultMin;

	[ObservableProperty]
	private decimal _resultMax;

	[ObservableProperty]
	private bool _hasResult;

	public List<string> Grades { get; } = ["C20", "C25", "C30", "C35", "C40", "C45", "C50"];

	private CancellationTokenSource? _cts;
	partial void OnSelectedGradeChanged(string value) => DebounceCalculate();
	partial void OnVolumeChanged(decimal value) => DebounceCalculate();
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
		if (Volume <= 0) return;
		HistoryItem item = calculator.CalculateConcrete(SelectedGrade, Volume);
		ResultMin = item.EmissionMin;
		ResultMax = item.EmissionMax;
		HasResult = true;
		await historyService.AddAsync(item);
		WeakReferenceMessenger.Default.Send(new HistoryItemAddedMessage(item));
	}

	[RelayCommand]
	private void Clear()
	{
		Volume = 0;
		ResultMin = 0;
		ResultMax = 0;
		HasResult = false;
	}
}
