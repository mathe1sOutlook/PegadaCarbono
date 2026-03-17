using CoreCO2.Reporting;

namespace CoreCO2.Building;

/// <summary>
/// Serviço de cálculo de emissões de CO₂ para edifícios de concreto armado.
/// Orquestra a tradução Building → Inventory e a chamada ao motor de cálculo existente.
/// </summary>
public interface IBuildingCO2Service
{
	/// <summary>
	/// Calcula as emissões de CO₂ do edifício e retorna um relatório completo.
	/// Escopo: A1-A3 (produção), A4 (transporte), A5 (construção).
	/// Valores normalizados por m² de área construída.
	/// </summary>
	/// <param name="building">Edifício com pavimentos e elementos estruturais.</param>
	/// <returns>Relatório com emissões min/max, desdobramento por módulo/material/pavimento.</returns>
	BuildingCO2Report Calculate(Building building);
}
