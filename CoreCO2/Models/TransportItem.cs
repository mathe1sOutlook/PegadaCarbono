namespace CoreCO2.Models;

/// <summary>
/// Item para cálculo de emissões de transporte (Equação 10 do CT 101).
/// C_t = Σ (q_i × m_i/1000 × d_t,i × e_t,i)
/// </summary>
/// <param name="ItemName">Nome do item transportado.</param>
/// <param name="QuantityKg">Massa do item transportado (kg).</param>
/// <param name="DistanceKm">Distância de transporte (km), ida e volta se aplicável.</param>
/// <param name="Mode">Modo de transporte.</param>
/// <param name="EmissionFactor">Fator de emissão do transporte (kg CO₂/t.km).</param>
public record TransportItem(
	string ItemName,
	decimal QuantityKg,
	decimal DistanceKm,
	TransportMode Mode,
	decimal EmissionFactor)
{
	/// <summary>Quantidade de transporte em t.km.</summary>
	public decimal TonKm => QuantityKg / 1000m * DistanceKm;

	/// <summary>Emissão de CO₂ do transporte deste item (kg CO₂).</summary>
	public decimal Emission => TonKm * EmissionFactor;
}
