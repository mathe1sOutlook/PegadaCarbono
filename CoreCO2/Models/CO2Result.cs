namespace CoreCO2.Models;

/// <summary>
/// Resultado do cálculo de emissões de CO₂ incorporadas.
/// </summary>
/// <param name="TotalMin">Emissão total mínima (kg CO₂/UF).</param>
/// <param name="TotalMax">Emissão total máxima (kg CO₂/UF).</param>
/// <param name="ByModule">Emissões desagregadas por módulo do ciclo de vida.</param>
/// <param name="ByCategory">Emissões desagregadas por categoria de emissão.</param>
/// <param name="Hotspots">Análise de contribuição dos itens mais relevantes.</param>
/// <param name="MaterialConsumption">Consumo de material (kg/UF) — Equação 43.</param>
public record CO2Result(
	decimal TotalMin,
	decimal TotalMax,
	IReadOnlyDictionary<LifeCycleModule, decimal> ByModule,
	IReadOnlyDictionary<EmissionCategory, decimal> ByCategory,
	IReadOnlyList<HotspotItem> Hotspots,
	decimal MaterialConsumption);

/// <summary>
/// Item da análise de contribuição (hotspot).
/// </summary>
/// <param name="ItemName">Nome do item contribuinte.</param>
/// <param name="EmissionKgCO2">Emissão em kg CO₂/UF.</param>
/// <param name="Percentage">Percentual de contribuição sobre o total.</param>
public record HotspotItem(
	string ItemName,
	decimal EmissionKgCO2,
	decimal Percentage);

/// <summary>
/// Resultado da propagação de incertezas (Equações 57-58 do CT 101).
/// </summary>
/// <param name="CentralEstimate">Estimativa central C̄ = Σ(q_i × ē_i).</param>
/// <param name="StandardDeviation">Desvio padrão dp(C) = √(Σ(q_i² × dp(e_i)²)).</param>
public record UncertaintyResult(
	decimal CentralEstimate,
	decimal StandardDeviation);

/// <summary>
/// Resultado do cálculo do estágio de fim de vida C1-C4 (Equações 35-40).
/// </summary>
/// <param name="Total">Emissão total C1-C4 em kg CO₂/UF.</param>
/// <param name="C1Demolition">C1: demolição/desconstrução (eletricidade + combustão).</param>
/// <param name="C2Transport">C2: transporte de resíduos da demolição.</param>
/// <param name="C3Recycling">C3: processamento de resíduos para reciclagem.</param>
/// <param name="C4Disposal">C4: disposição final de resíduos.</param>
public record EndOfLifeResult(
	decimal Total,
	decimal C1Demolition,
	decimal C2Transport,
	decimal C3Recycling,
	decimal C4Disposal);

/// <summary>
/// Resultado do cálculo do estágio de substituições B4 (Equações 30-34).
/// </summary>
/// <param name="Total">Emissão total B4 em kg CO₂/UF.</param>
/// <param name="ProductionEmission">Emissões de produção dos materiais de reposição (Eq. 31).</param>
/// <param name="TransportEmission">Emissões de transporte dos materiais de reposição (Eq. 32).</param>
/// <param name="WasteEmission">Emissões de transporte e disposição de resíduos (Eq. 33-34).</param>
/// <param name="Details">Detalhamento por material substituído.</param>
public record ReplacementResult(
	decimal Total,
	decimal ProductionEmission,
	decimal TransportEmission,
	decimal WasteEmission,
	IReadOnlyList<ReplacementDetail> Details);

/// <summary>
/// Detalhe de substituição por material.
/// </summary>
/// <param name="ItemName">Nome do material.</param>
/// <param name="ReplacementCount">Número de substituições (Eq. 1).</param>
/// <param name="EmissionKgCO2">Emissão total para todas as substituições deste material.</param>
public record ReplacementDetail(string ItemName, int ReplacementCount, decimal EmissionKgCO2);

/// <summary>
/// Escopo do cálculo de ciclo de vida.
/// </summary>
public class LifeCycleScope
{
	/// <summary>Módulos incluídos no escopo.</summary>
	public required IReadOnlySet<LifeCycleModule> Modules { get; init; }

	/// <summary>Período de referência em anos (para módulo B4 — substituições).</summary>
	public int? ReferencePeriodYears { get; init; }

	/// <summary>Escopo mínimo obrigatório: A1-A3.</summary>
	public static LifeCycleScope ProductStage => new()
	{
		Modules = new HashSet<LifeCycleModule> { LifeCycleModule.A1, LifeCycleModule.A2, LifeCycleModule.A3 }
	};

	/// <summary>Escopo recomendado: A1-A5.</summary>
	public static LifeCycleScope CradleToSite => new()
	{
		Modules = new HashSet<LifeCycleModule>
		{
			LifeCycleModule.A1, LifeCycleModule.A2, LifeCycleModule.A3,
			LifeCycleModule.A4, LifeCycleModule.A5
		}
	};
}
