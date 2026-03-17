using app_CO2.Messages;
using app_CO2.Models;
using app_CO2.Services;

namespace app_CO2.ViewModels;

public partial class HistoryPanelViewModel : ObservableObject, IRecipient<HistoryItemAddedMessage>
{
	private readonly IHistoryService _historyService;
	private readonly IExportService _exportService;

	public ObservableCollection<HistoryItem> Items { get; } = [];

	[ObservableProperty]
	private decimal _totalMin;

	[ObservableProperty]
	private decimal _totalMax;

	public HistoryPanelViewModel(IHistoryService historyService, IExportService exportService)
	{
		_historyService = historyService;
		_exportService = exportService;
		WeakReferenceMessenger.Default.Register(this);
		_ = LoadHistoryAsync();
	}

	public void Receive(HistoryItemAddedMessage message)
	{
		HistoryItem item = message.Value;
		Items.Insert(0, item);
		item.PropertyChanged += (_, _) => RecalculateTotal();
		RecalculateTotal();
	}

	[RelayCommand]
	private async Task LoadHistoryAsync()
	{
		List<HistoryItem> items = await _historyService.LoadAsync();
		Items.Clear();
		foreach (HistoryItem item in items)
		{
			Items.Add(item);
			item.PropertyChanged += (_, _) => RecalculateTotal();
		}
		RecalculateTotal();
	}

	[RelayCommand]
	private async Task RemoveItemAsync(HistoryItem item)
	{
		Items.Remove(item);
		await _historyService.RemoveAsync(item.Id);
		RecalculateTotal();
	}

	[RelayCommand]
	private async Task ClearAllAsync()
	{
		Items.Clear();
		await _historyService.ClearAsync();
		RecalculateTotal();
	}

	[RelayCommand]
	private async Task ExportCsvAsync()
	{
		IEnumerable<HistoryItem> included = Items.Where(i => i.IsIncluded);
		string csv = await _exportService.GenerateCsvAsync(included);
		await _exportService.CopyToClipboardAsync(csv);
	}

	private void RecalculateTotal()
	{
		IEnumerable<HistoryItem> included = Items.Where(i => i.IsIncluded);
		TotalMin = included.Sum(i => i.EmissionMin);
		TotalMax = included.Sum(i => i.EmissionMax);
	}
}
