using app_CO2.Models;

namespace app_CO2.Services;

public interface IUserFactorService
{
	Task<List<UserFactorOverride>> LoadOverridesAsync();
	Task SaveOverrideAsync(UserFactorOverride factor);
	Task RemoveOverrideAsync(string category, string key);
	Task ClearAllAsync();
	Task<UserFactorOverride?> GetOverrideAsync(string category, string key);
}
