using app_CO2.Models;

namespace app_CO2.Services;

public class ProjectService : IProjectService
{
	private static readonly string ProjectsDir = Path.Combine(
		Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
		"app_CO2", "projects");

	private readonly SemaphoreSlim _lock = new(1, 1);

	public async Task<List<BuildingProject>> ListAsync()
	{
		await _lock.WaitAsync();
		try
		{
			if (!Directory.Exists(ProjectsDir)) return [];
			List<BuildingProject> projects = [];
			foreach (string file in Directory.GetFiles(ProjectsDir, "*.json"))
			{
				string json = await File.ReadAllTextAsync(file);
				BuildingProject? p = JsonSerializer.Deserialize<BuildingProject>(json);
				if (p is not null) projects.Add(p);
			}
			return projects.OrderByDescending(p => p.UpdatedAt).ToList();
		}
		finally { _lock.Release(); }
	}

	public async Task<BuildingProject?> GetAsync(string id)
	{
		await _lock.WaitAsync();
		try
		{
			string path = Path.Combine(ProjectsDir, $"{id}.json");
			if (!File.Exists(path)) return null;
			string json = await File.ReadAllTextAsync(path);
			return JsonSerializer.Deserialize<BuildingProject>(json);
		}
		finally { _lock.Release(); }
	}

	public async Task SaveAsync(BuildingProject project)
	{
		await _lock.WaitAsync();
		try
		{
			Directory.CreateDirectory(ProjectsDir);
			project.UpdatedAt = DateTime.Now;
			string json = JsonSerializer.Serialize(project, new JsonSerializerOptions { WriteIndented = true });
			await File.WriteAllTextAsync(Path.Combine(ProjectsDir, $"{project.Id}.json"), json);
		}
		finally { _lock.Release(); }
	}

	public async Task DeleteAsync(string id)
	{
		await _lock.WaitAsync();
		try
		{
			string path = Path.Combine(ProjectsDir, $"{id}.json");
			if (File.Exists(path)) File.Delete(path);
		}
		finally { _lock.Release(); }
	}
}
