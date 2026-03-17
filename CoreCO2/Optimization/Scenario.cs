namespace CoreCO2.Optimization;

/// <summary>
/// Cenário de otimização: define uma transformação a ser aplicada em um edifício baseline.
/// </summary>
/// <param name="Name">Nome descritivo do cenário (ex.: "Trocar C35 por C30").</param>
/// <param name="Description">Descrição da transformação.</param>
/// <param name="Transform">Função que aplica a transformação e retorna o edifício modificado.</param>
public record Scenario(
	string Name,
	string Description,
	Func<CoreCO2.Building.Building, CoreCO2.Building.Building> Transform);
