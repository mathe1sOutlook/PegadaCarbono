using CoreCO2.Building;

namespace CoreCO2.Optimization;

/// <summary>
/// Implementação do serviço de comparação de edifícios.
/// Usa IBuildingCO2Service para calcular emissões de cada alternativa.
/// </summary>
public class BuildingComparisonService : IBuildingComparisonService
{
	private readonly IBuildingCO2Service _co2Service;

	public BuildingComparisonService(IBuildingCO2Service co2Service)
	{
		_co2Service = co2Service ?? throw new ArgumentNullException(nameof(co2Service));
	}

	/// <inheritdoc />
	public ComparisonReport Compare(
		CoreCO2.Building.Building baseline,
		CoreCO2.Building.Building alternative,
		string scenarioName = "Comparação direta",
		string scenarioDescription = "")
	{
		ArgumentNullException.ThrowIfNull(baseline);
		ArgumentNullException.ThrowIfNull(alternative);

		var baselineReport = _co2Service.Calculate(baseline);
		var alternativeReport = _co2Service.Calculate(alternative);

		return new ComparisonReport
		{
			ScenarioName = scenarioName,
			ScenarioDescription = scenarioDescription,
			Baseline = baselineReport,
			Alternative = alternativeReport,
		};
	}

	/// <inheritdoc />
	public IReadOnlyList<ComparisonReport> EvaluateScenarios(
		CoreCO2.Building.Building baseline,
		IEnumerable<Scenario> scenarios)
	{
		ArgumentNullException.ThrowIfNull(baseline);
		ArgumentNullException.ThrowIfNull(scenarios);

		var baselineReport = _co2Service.Calculate(baseline);
		var reports = new List<ComparisonReport>();

		foreach (var scenario in scenarios)
		{
			var alternative = scenario.Transform(baseline);
			var alternativeReport = _co2Service.Calculate(alternative);

			reports.Add(new ComparisonReport
			{
				ScenarioName = scenario.Name,
				ScenarioDescription = scenario.Description,
				Baseline = baselineReport,
				Alternative = alternativeReport,
			});
		}

		return reports;
	}
}
