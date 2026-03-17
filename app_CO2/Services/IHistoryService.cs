using app_CO2.Models;

namespace app_CO2.Services;

public interface IHistoryService
{
	Task<List<HistoryItem>> LoadAsync();
	Task SaveAsync(List<HistoryItem> items);
	Task AddAsync(HistoryItem item);
	Task RemoveAsync(string id);
	Task ClearAsync();
}
