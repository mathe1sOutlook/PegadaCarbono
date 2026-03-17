using CoreCO2.Models;

namespace CoreCO2.Materials;

/// <summary>
/// Catálogo de materiais com fatores de emissão padrão do CT 101/Sidac.
/// Fonte: Boletim Técnico IBRACON/ABECE/ABCIC — CT 101, 1ª Edição, 2024.
/// Dados Sidac para concreto, aço e fôrmas.
/// </summary>
public static class MaterialCatalog
{
	/// <summary>
	/// Fatores de emissão de CO₂ para concreto por classe de resistência (kg CO₂/m³).
	/// Fonte: Sidac (valores utilizados no exemplo da seção 12.2 do CT 101).
	/// </summary>
	public static IReadOnlyDictionary<ConcreteGrade, EmissionFactor> ConcreteFactors { get; } =
		new Dictionary<ConcreteGrade, EmissionFactor>
		{
			[ConcreteGrade.C20] = new("C20", 180m, 280m, "kg CO₂/m³", "Sidac"),
			[ConcreteGrade.C25] = new("C25", 200m, 310m, "kg CO₂/m³", "Sidac"),
			[ConcreteGrade.C30] = new("C30", 228m, 339m, "kg CO₂/m³", "Sidac"),
			[ConcreteGrade.C35] = new("C35", 257m, 374m, "kg CO₂/m³", "Sidac"),
			[ConcreteGrade.C40] = new("C40", 290m, 410m, "kg CO₂/m³", "Sidac"),
			[ConcreteGrade.C45] = new("C45", 320m, 450m, "kg CO₂/m³", "Sidac"),
			[ConcreteGrade.C50] = new("C50", 350m, 490m, "kg CO₂/m³", "Sidac"),
		};

	/// <summary>
	/// Fatores de emissão de CO₂ para aço por tipo (kg CO₂/kg).
	/// Fonte: Sidac (Tabela 23 do CT 101).
	/// </summary>
	public static IReadOnlyDictionary<SteelGrade, EmissionFactor> SteelFactors { get; } =
		new Dictionary<SteelGrade, EmissionFactor>
		{
			[SteelGrade.CA50] = new("CA50", 0.45m, 1.1m, "kg CO₂/kg", "Sidac"),
			[SteelGrade.CA60] = new("CA60", 0.45m, 1.1m, "kg CO₂/kg", "Sidac"),
		};

	/// <summary>
	/// Fatores de emissão de CO₂ para materiais de fôrma.
	/// Compensado plastificado: kg CO₂/m² (por uso, antes de aplicar reutilizações).
	/// Madeira serrada: kg CO₂/m³.
	/// Metálica: emissão zero por uso (reutilizável centenas de vezes).
	/// </summary>
	public static IReadOnlyDictionary<FormworkMaterial, EmissionFactor> FormworkFactors { get; } =
		new Dictionary<FormworkMaterial, EmissionFactor>
		{
			[FormworkMaterial.CompensadoPlastificado] = new("CompensadoPlastificado", 7.2m, 10.8m, "kg CO₂/m²", "EPD"),
			[FormworkMaterial.MadeiraSerradaBruta] = new("MadeiraSerrada", 17m, 35m, "kg CO₂/m³", "Sidac"),
			[FormworkMaterial.Metalica] = new("FormaMetalica", 0m, 0m, "kg CO₂/uso", "Estimativa"),
		};

	/// <summary>
	/// Densidades aproximadas do concreto por classe de resistência (kg/m³).
	/// Valores típicos para concreto armado convencional.
	/// </summary>
	public static IReadOnlyDictionary<ConcreteGrade, decimal> ConcreteDensities { get; } =
		new Dictionary<ConcreteGrade, decimal>
		{
			[ConcreteGrade.C20] = 2350m,
			[ConcreteGrade.C25] = 2360m,
			[ConcreteGrade.C30] = 2373m,
			[ConcreteGrade.C35] = 2387m,
			[ConcreteGrade.C40] = 2400m,
			[ConcreteGrade.C45] = 2410m,
			[ConcreteGrade.C50] = 2420m,
		};

	/// <summary>
	/// Configurações de transporte padrão por tipo de material.
	/// Distâncias baseadas nos exemplos do CT 101.
	/// </summary>
	public static TransportConfig GetDefaultTransport(string materialType) =>
		materialType switch
		{
			"Concreto" => new(TransportMode.Betoneira, 20m, 0.096m),
			"Aco" => new(TransportMode.Truck4Eixos, 300m, 0.066m),
			"Compensado" => new(TransportMode.Truck4Eixos, 500m, 0.066m),
			"MadeiraSerrada" => new(TransportMode.Truck4Eixos, 500m, 0.066m),
			"Residuo" => new(TransportMode.Truck3Eixos, 60m, 0.0601m),
			_ => new(TransportMode.Truck3Eixos, 100m, 0.0601m),
		};
}
