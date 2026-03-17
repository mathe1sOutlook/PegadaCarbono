using CoreCO2.Models;

namespace CoreCO2.Building.Translation;

/// <summary>
/// Traduz um Building (modelo de domínio) para os modelos de entrada do motor de cálculo existente.
/// Pipeline: Building → Inventory + TransportItems + ConstructionStageInput → ICO2CalculationService.
/// </summary>
public interface IBuildingInventoryTranslator
{
	/// <summary>
	/// Traduz um edifício para os dados de entrada do cálculo de CO₂.
	/// Todos os valores são normalizados por m² de área construída (unidade funcional CT 101).
	/// </summary>
	/// <param name="building">Edifício a ser traduzido.</param>
	/// <returns>Dados de entrada para os métodos de cálculo existentes.</returns>
	BuildingInventoryData Translate(Building building);
}

/// <summary>
/// Dados intermediários produzidos pela tradução Building → motor de cálculo.
/// </summary>
/// <param name="ProductStageInventory">
/// Inventário para CalculateProductStage → CO2Result (A1-A3).
/// Contém apenas concreto + aço, LossRatio=0. Fôrmas vão para A5.
/// </param>
/// <param name="TransportToSiteItems">
/// Itens para CalculateTransportToSite → A4.
/// Inclui transporte de concreto (com perdas), aço (com perdas) e fôrmas até a obra.
/// </param>
/// <param name="ConstructionInputMin">
/// Entrada para CalculateConstructionStage → A5 (com fatores mínimos).
/// Inclui diesel, produção de materiais desperdiçados, fôrmas e resíduos.
/// </param>
/// <param name="ConstructionInputMax">
/// Entrada para CalculateConstructionStage → A5 (com fatores máximos).
/// </param>
public record BuildingInventoryData(
	Inventory ProductStageInventory,
	IReadOnlyList<TransportItem> TransportToSiteItems,
	ConstructionStageInput ConstructionInputMin,
	ConstructionStageInput ConstructionInputMax);
