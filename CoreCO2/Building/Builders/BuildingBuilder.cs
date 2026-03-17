namespace CoreCO2.Building.Builders;

/// <summary>
/// Builder fluente para construção de um edifício (Building).
/// </summary>
public class BuildingBuilder
{
	private string _name = "";
	private string? _description;
	private int _referencePeriodYears = 50;
	private BuildingTransportConfig? _transportConfig;
	private ConstructionConfig? _constructionConfig;
	private readonly List<Floor> _floors = [];

	/// <summary>Cria um novo BuildingBuilder.</summary>
	public static BuildingBuilder Create(string name) => new() { _name = name };

	/// <summary>Define a descrição do edifício.</summary>
	public BuildingBuilder WithDescription(string description)
	{
		_description = description;
		return this;
	}

	/// <summary>Define o período de referência em anos (default 50).</summary>
	public BuildingBuilder WithReferencePeriod(int years)
	{
		_referencePeriodYears = years;
		return this;
	}

	/// <summary>Define a configuração de transporte do edifício.</summary>
	public BuildingBuilder WithTransport(BuildingTransportConfig transportConfig)
	{
		_transportConfig = transportConfig;
		return this;
	}

	/// <summary>Define os parâmetros do estágio A5 (construção).</summary>
	public BuildingBuilder WithConstructionConfig(ConstructionConfig constructionConfig)
	{
		_constructionConfig = constructionConfig;
		return this;
	}

	/// <summary>Adiciona um pavimento pronto ao edifício.</summary>
	public BuildingBuilder AddFloor(Floor floor)
	{
		_floors.Add(floor);
		return this;
	}

	/// <summary>
	/// Adiciona um pavimento construído via FloorBuilder.
	/// </summary>
	public BuildingBuilder AddFloor(Func<FloorBuilder, FloorBuilder> configure)
	{
		var builder = new FloorBuilder();
		configure(builder);
		_floors.Add(builder.Build());
		return this;
	}

	/// <summary>Constrói o Building imutável.</summary>
	public Building Build()
	{
		if (string.IsNullOrWhiteSpace(_name))
			throw new InvalidOperationException("Nome do edifício é obrigatório.");
		if (_floors.Count == 0)
			throw new InvalidOperationException("O edifício deve ter pelo menos um pavimento.");

		return new Building(
			_name,
			_floors.AsReadOnly(),
			_transportConfig,
			_constructionConfig,
			_description,
			_referencePeriodYears);
	}
}
