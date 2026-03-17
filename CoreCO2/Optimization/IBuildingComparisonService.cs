namespace CoreCO2.Optimization;

/// <summary>
/// Serviço de comparação e otimização de edifícios.
/// Permite avaliar cenários de redução de CO₂.
/// </summary>
public interface IBuildingComparisonService
{
	/// <summary>
	/// Compara dois edifícios (baseline vs alternativa).
	/// </summary>
	/// <param name="baseline">Edifício de referência.</param>
	/// <param name="alternative">Edifício alternativo.</param>
	/// <param name="scenarioName">Nome do cenário de comparação.</param>
	/// <param name="scenarioDescription">Descrição da comparação.</param>
	/// <returns>Relatório de comparação com reduções absolutas e percentuais.</returns>
	ComparisonReport Compare(
		CoreCO2.Building.Building baseline,
		CoreCO2.Building.Building alternative,
		string scenarioName = "Comparação direta",
		string scenarioDescription = "");

	/// <summary>
	/// Avalia múltiplos cenários de otimização sobre um edifício baseline.
	/// Cada cenário aplica uma transformação e compara com o baseline.
	/// </summary>
	/// <param name="baseline">Edifício de referência.</param>
	/// <param name="scenarios">Cenários de otimização a avaliar.</param>
	/// <returns>Lista de relatórios de comparação, um por cenário.</returns>
	IReadOnlyList<ComparisonReport> EvaluateScenarios(
		CoreCO2.Building.Building baseline,
		IEnumerable<Scenario> scenarios);
}
