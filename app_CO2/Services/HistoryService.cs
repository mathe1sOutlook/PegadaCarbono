using app_CO2.Models;

namespace app_CO2.Services;

public class HistoryService : IHistoryService
{
	private static readonly string FilePath = Path.Combine(
		Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
		"app_CO2", "history.json");

	private readonly SemaphoreSlim _lock = new(1, 1);

	public async Task<List<HistoryItem>> LoadAsync()
	{
		await _lock.WaitAsync();
		try
		{
			if (!File.Exists(FilePath)) return [];
			string json = await File.ReadAllTextAsync(FilePath);
			return JsonSerializer.Deserialize<List<HistoryItem>>(json) ?? [];
		}
		finally { _lock.Release(); }
	}

	public async Task SaveAsync(List<HistoryItem> items)
	{
		await _lock.WaitAsync();
		try
		{
			Directory.CreateDirectory(Path.GetDirectoryName(FilePath)!);
			string json = JsonSerializer.Serialize(items, new JsonSerializerOptions { WriteIndented = true });
			await File.WriteAllTextAsync(FilePath, json);
		}
		finally { _lock.Release(); }
	}

	public async Task AddAsync(HistoryItem item)
	{
		List<HistoryItem> items = await LoadAsync();
		items.Add(item);
		await SaveAsync(items);
	}

	public async Task RemoveAsync(string id)
	{
		List<HistoryItem> items = await LoadAsync();
		items.RemoveAll(i => i.Id == id);
		await SaveAsync(items);
	}

	public async Task ClearAsync() => await SaveAsync([]);
}
