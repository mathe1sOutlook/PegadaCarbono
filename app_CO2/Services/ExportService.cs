using System.Text;
using app_CO2.Models;

namespace app_CO2.Services;

public class ExportService : IExportService
{
	public async Task CopyToClipboardAsync(string text)
		=> await Clipboard.Default.SetTextAsync(text);

	public Task<string> GenerateCsvAsync(IEnumerable<HistoryItem> items)
	{
		StringBuilder sb = new();
		sb.AppendLine("Material;Descrição;Emissão Mín;Emissão Máx;Unidade;Data");
		foreach (HistoryItem item in items)
		{
			sb.AppendLine($"{item.MaterialType};{item.Description};{item.EmissionMin};{item.EmissionMax};{item.Unit};{item.Timestamp:dd/MM/yyyy HH:mm}");
		}
		return Task.FromResult(sb.ToString());
	}

	public async Task ExportCsvToFileAsync(IEnumerable<HistoryItem> items, string filePath)
	{
		string csv = await GenerateCsvAsync(items);
		await File.WriteAllTextAsync(filePath, csv, Encoding.UTF8);
	}
}
