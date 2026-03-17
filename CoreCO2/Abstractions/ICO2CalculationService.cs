using CoreCO2.Models;

namespace CoreCO2.Abstractions;

/// <summary>
/// Serviço de cálculo de emissões de CO₂ incorporadas em materiais cimentícios
/// e estruturas de concreto conforme CT 101 (IBRACON/ABECE/ABCIC).
/// </summary>
public interface ICO2CalculationService
{
	/// <summary>
	/// Calcula a emissão total de CO₂ — Equação 5: C = Σ(q_i × e_i).
	/// </summary>
	/// <param name="items">Pares (quantidade, fator de emissão).</param>
	/// <returns>Emissão total em kg CO₂/UF.</returns>
	decimal CalculateSimpleEmission(IEnumerable<(decimal quantity, decimal emissionFactor)> items);

	/// <summary>
	/// Calcula emissões de transporte — Equação 10: C_t = Σ(q_i × m_i/1000 × d_t,i × e_t,i).
	/// </summary>
	/// <param name="items">Itens de transporte com massa, distância e fator.</param>
	/// <returns>Emissão total de transporte em kg CO₂/UF.</returns>
	decimal CalculateTransportEmission(IEnumerable<TransportItem> items);

	/// <summary>
	/// Calcula emissão de combustão de combustíveis fósseis — Equação 7.
	/// </summary>
	/// <param name="fuelQuantities">Pares (quantidade do combustível, fator de emissão).</param>
	/// <returns>Emissão em kg CO₂/UF.</returns>
	decimal CalculateCombustionEmission(IEnumerable<(decimal quantity, decimal emissionFactor)> fuelQuantities);

	/// <summary>
	/// Calcula emissão por decomposição de carbonatos — Equação 8.
	/// </summary>
	/// <param name="carbonateQuantityKg">Quantidade de carbonato (kg).</param>
	/// <param name="emissionFactor">Fator de emissão (kg CO₂/kg carbonato).</param>
	/// <returns>Emissão em kg CO₂.</returns>
	decimal CalculateCalcinationEmission(decimal carbonateQuantityKg, decimal emissionFactor);

	/// <summary>
	/// Calcula emissão de biomassa não renovável — Equação 9.
	/// C = biomassa_seca × 0.5 × 44/12
	/// </summary>
	/// <param name="dryBiomassKg">Massa de biomassa seca (kg).</param>
	/// <returns>Emissão em kg CO₂.</returns>
	decimal CalculateBiomassEmission(decimal dryBiomassKg);

	/// <summary>
	/// Calcula emissões do estágio de produto A1-A3 a partir do inventário — Equações 12-19.
	/// </summary>
	/// <param name="inventory">Inventário completo com fatores de emissão.</param>
	/// <returns>Resultado com emissões min/max, por categoria e hotspots.</returns>
	CO2Result CalculateProductStage(Inventory inventory);

	/// <summary>
	/// Calcula emissões de transporte do produto até a obra — Equação 21 (módulo A4).
	/// Mesma fórmula de CalculateTransportEmission, com distâncias fábrica→obra.
	/// </summary>
	/// <param name="items">Itens de transporte com massa, distância até obra e fator.</param>
	/// <returns>Emissão total A4 em kg CO₂/UF.</returns>
	decimal CalculateTransportToSite(IEnumerable<TransportItem> items);

	/// <summary>
	/// Propaga incertezas nos fatores de emissão via série de Taylor — Equações 57-58.
	/// </summary>
	/// <param name="items">Triplas (quantidade, fator mínimo, fator máximo).</param>
	/// <returns>Estimativa central e desvio padrão da emissão.</returns>
	UncertaintyResult PropagateUncertainty(
		IEnumerable<(decimal quantity, decimal factorMin, decimal factorMax)> items);

	/// <summary>
	/// Calcula emissões do estágio de construção A5 — Equações 22-29.
	/// Inclui eletricidade, combustão, perdas de materiais e resíduos da obra.
	/// </summary>
	/// <param name="input">Dados do processo construtivo.</param>
	/// <returns>Emissão total A5 em kg CO₂/UF.</returns>
	decimal CalculateConstructionStage(ConstructionStageInput input);

	/// <summary>
	/// Calcula emissões do estágio de fim de vida C1-C4 — Equações 35-40.
	/// Inclui demolição (C1), transporte de resíduos (C2), reciclagem (C3) e disposição (C4).
	/// </summary>
	/// <param name="input">Dados do fim de vida.</param>
	/// <returns>Emissão total C1-C4 em kg CO₂/UF e desdobramento por módulo.</returns>
	EndOfLifeResult CalculateEndOfLife(EndOfLifeInput input);

	/// <summary>
	/// Calcula emissões do estágio de substituições B4 — Equações 30-34.
	/// Calcula nº de substituições (Eq. 1) e soma produção + transporte + resíduos de cada.
	/// </summary>
	/// <param name="input">Dados das substituições.</param>
	/// <returns>Emissão total B4 em kg CO₂/UF e detalhamento por material.</returns>
	ReplacementResult CalculateReplacementStage(ReplacementInput input);

	/// <summary>
	/// Calcula o número de reposições de um material — Equação 1: n = ⌈PR/VU⌉ - 1.
	/// </summary>
	/// <param name="referencePeriodYears">Período de referência (anos).</param>
	/// <param name="materialLifeYears">Vida útil do material (anos).</param>
	/// <returns>Número de reposições.</returns>
	int CalculateReplacements(int referencePeriodYears, int materialLifeYears);

	/// <summary>
	/// Gera análise de contribuição (hotspot) a partir de emissões por item.
	/// </summary>
	/// <param name="itemEmissions">Emissões por item (nome, valor em kg CO₂).</param>
	/// <returns>Lista ordenada por contribuição decrescente.</returns>
	IReadOnlyList<HotspotItem> AnalyzeHotspots(IEnumerable<(string itemName, decimal emissionKgCO2)> itemEmissions);
}
