namespace CoreCO2.Models;

/// <summary>
/// Item de resíduo com dados de transporte e disposição final.
/// Usado nos estágios A5, B4 e C1-C4.
/// </summary>
/// <param name="ItemName">Nome do resíduo (ex.: "Concreto", "Aço", "Madeira").</param>
/// <param name="QuantityKg">Quantidade de resíduo (kg/UF).</param>
/// <param name="TransportMode">Modo de transporte até o destino.</param>
/// <param name="TransportDistanceKm">Distância até o destino (aterro, reciclagem, etc.) em km.</param>
/// <param name="DisposalEmissionFactor">Fator de emissão para disposição final C4 (kg CO₂/kg). Eq. 40.</param>
/// <param name="RecyclingEmissionFactor">Fator de emissão para processamento/reciclagem C3 (kg CO₂/kg). Eq. 39. Default 0.</param>
public record WasteItem(
	string ItemName,
	decimal QuantityKg,
	TransportMode TransportMode,
	decimal TransportDistanceKm,
	decimal DisposalEmissionFactor = 0m,
	decimal RecyclingEmissionFactor = 0m);
