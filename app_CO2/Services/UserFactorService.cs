using app_CO2.Models;

namespace app_CO2.Services;

public class UserFactorService : IUserFactorService
{
	private static readonly string FilePath = Path.Combine(
		Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
		"app_CO2", "user_factors.json");

	private readonly SemaphoreSlim _lock = new(1, 1);
	private List<UserFactorOverride>? _cache;

	public async Task<List<UserFactorOverride>> LoadOverridesAsync()
	{
		await _lock.WaitAsync();
		try
		{
			if (_cache is not null) return _cache;
			if (!File.Exists(FilePath)) { _cache = []; return _cache; }
			string json = await File.ReadAllTextAsync(FilePath);
			_cache = JsonSerializer.Deserialize<List<UserFactorOverride>>(json) ?? [];
			return _cache;
		}
		finally { _lock.Release(); }
	}

	public async Task SaveOverrideAsync(UserFactorOverride factor)
	{
		List<UserFactorOverride> overrides = await LoadOverridesAsync();
		overrides.RemoveAll(o => o.Category == factor.Category && o.Key == factor.Key);
		overrides.Add(factor);
		_cache = overrides;
		await PersistAsync();
	}

	public async Task RemoveOverrideAsync(string category, string key)
	{
		List<UserFactorOverride> overrides = await LoadOverridesAsync();
		overrides.RemoveAll(o => o.Category == category && o.Key == key);
		_cache = overrides;
		await PersistAsync();
	}

	public async Task ClearAllAsync()
	{
		_cache = [];
		await PersistAsync();
	}

	public async Task<UserFactorOverride?> GetOverrideAsync(string category, string key)
	{
		List<UserFactorOverride> overrides = await LoadOverridesAsync();
		return overrides.FirstOrDefault(o => o.Category == category && o.Key == key);
	}

	private async Task PersistAsync()
	{
		await _lock.WaitAsync();
		try
		{
			Directory.CreateDirectory(Path.GetDirectoryName(FilePath)!);
			string json = JsonSerializer.Serialize(_cache, new JsonSerializerOptions { WriteIndented = true });
			await File.WriteAllTextAsync(FilePath, json);
		}
		finally { _lock.Release(); }
	}
}
