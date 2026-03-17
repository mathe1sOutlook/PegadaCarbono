namespace app_CO2.Models;

public class HistoryItem : ObservableObject
{
	public string Id { get; set; } = Guid.NewGuid().ToString("N")[..8];
	public DateTime Timestamp { get; set; } = DateTime.Now;
	public string MaterialType { get; set; } = string.Empty; // "Concreto", "Aço", "Fôrma", "Transporte"
	public string Description { get; set; } = string.Empty;
	public decimal EmissionMin { get; set; }
	public decimal EmissionMax { get; set; }
	public string Unit { get; set; } = "kgCO₂";

	private bool _isIncluded = true;
	public bool IsIncluded
	{
		get => _isIncluded;
		set => SetProperty(ref _isIncluded, value);
	}
}
