using app_CO2.Models;

namespace app_CO2.Services;

public interface IProjectService
{
	Task<List<BuildingProject>> ListAsync();
	Task<BuildingProject?> GetAsync(string id);
	Task SaveAsync(BuildingProject project);
	Task DeleteAsync(string id);
}
