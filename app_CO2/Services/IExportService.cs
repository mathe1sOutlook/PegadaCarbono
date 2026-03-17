using app_CO2.Models;

namespace app_CO2.Services;

public interface IExportService
{
	Task CopyToClipboardAsync(string text);
	Task<string> GenerateCsvAsync(IEnumerable<HistoryItem> items);
	Task ExportCsvToFileAsync(IEnumerable<HistoryItem> items, string filePath);
}
