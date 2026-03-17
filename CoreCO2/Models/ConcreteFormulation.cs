namespace CoreCO2.Models;

/// <summary>
/// Traço de concreto (composição por m³) conforme dosagem em central.
/// </summary>
/// <param name="StrengthGrade">Classe de resistência (ex.: "25 MPa", "30 MPa").</param>
/// <param name="CementContentKgM3">Consumo de cimento (kg/m³).</param>
/// <param name="SandContentKgM3">Consumo de areia (kg/m³).</param>
/// <param name="GravelContentKgM3">Consumo de brita (kg/m³).</param>
/// <param name="AdditiveContentKgM3">Consumo de aditivo (kg/m³).</param>
/// <param name="WaterContentLM3">Consumo de água (L/m³).</param>
public record ConcreteFormulation(
	string StrengthGrade,
	decimal CementContentKgM3,
	decimal SandContentKgM3,
	decimal GravelContentKgM3,
	decimal AdditiveContentKgM3,
	decimal WaterContentLM3)
{
	/// <summary>Massa específica aproximada do concreto (kg/m³).</summary>
	public decimal ApproximateDensity =>
		CementContentKgM3 + SandContentKgM3 + GravelContentKgM3 +
		AdditiveContentKgM3 + WaterContentLM3;
}
