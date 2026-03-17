namespace app_CO2.Models;

public record UserFactorOverride(
	string Category,     // "Fuel", "Carbonate", "Transport", "Concrete", "Steel", "Formwork"
	string Key,          // e.g. "C30", "CA50", "DieselOil"
	decimal FactorMin,
	decimal FactorMax,
	string Unit,
	DateTime OverriddenAt);
