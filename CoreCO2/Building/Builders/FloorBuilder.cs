using CoreCO2.Building.Elements;
using CoreCO2.Materials;

namespace CoreCO2.Building.Builders;

/// <summary>
/// Builder fluente para construção de um pavimento (Floor).
/// </summary>
public class FloorBuilder
{
	private string _name = "";
	private FloorType _floorType = FloorType.TypicalFloor;
	private decimal _floorHeightM = 3.0m;
	private decimal _areaM2;
	private int _repetitionCount = 1;
	private readonly List<StructuralElement> _elements = [];

	/// <summary>Cria um novo FloorBuilder.</summary>
	public static FloorBuilder Create(string name) => new() { _name = name };

	/// <summary>Define o tipo do pavimento.</summary>
	public FloorBuilder WithType(FloorType type)
	{
		_floorType = type;
		return this;
	}

	/// <summary>Define o pé-direito do pavimento (m).</summary>
	public FloorBuilder WithHeight(decimal heightM)
	{
		_floorHeightM = heightM;
		return this;
	}

	/// <summary>Define a área do pavimento (m²).</summary>
	public FloorBuilder WithArea(decimal areaM2)
	{
		_areaM2 = areaM2;
		return this;
	}

	/// <summary>Define o número de repetições (para pavimentos tipo).</summary>
	public FloorBuilder WithRepetitions(int count)
	{
		_repetitionCount = count;
		return this;
	}

	/// <summary>Adiciona um elemento estrutural ao pavimento.</summary>
	public FloorBuilder AddElement(StructuralElement element)
	{
		_elements.Add(element);
		return this;
	}

	/// <summary>
	/// Adiciona um pilar ao pavimento.
	/// </summary>
	public FloorBuilder AddPilar(
		string name,
		decimal concreteVolumeM3,
		ConcreteGrade concreteGrade,
		decimal steelQuantityKg,
		decimal formworkAreaM2 = 0m,
		SteelGrade steelGrade = SteelGrade.CA50,
		FormworkMaterial formworkMaterial = FormworkMaterial.CompensadoPlastificado,
		int formworkReuses = 12)
	{
		_elements.Add(new StructuralElement(
			name, StructuralElementType.Pilar,
			concreteVolumeM3, concreteGrade,
			steelQuantityKg, steelGrade,
			formworkAreaM2, formworkMaterial, formworkReuses));
		return this;
	}

	/// <summary>
	/// Adiciona uma viga ao pavimento.
	/// </summary>
	public FloorBuilder AddViga(
		string name,
		decimal concreteVolumeM3,
		ConcreteGrade concreteGrade,
		decimal steelQuantityKg,
		decimal formworkAreaM2 = 0m,
		SteelGrade steelGrade = SteelGrade.CA50,
		FormworkMaterial formworkMaterial = FormworkMaterial.CompensadoPlastificado,
		int formworkReuses = 12)
	{
		_elements.Add(new StructuralElement(
			name, StructuralElementType.Viga,
			concreteVolumeM3, concreteGrade,
			steelQuantityKg, steelGrade,
			formworkAreaM2, formworkMaterial, formworkReuses));
		return this;
	}

	/// <summary>
	/// Adiciona uma laje ao pavimento.
	/// </summary>
	public FloorBuilder AddLaje(
		string name,
		decimal concreteVolumeM3,
		ConcreteGrade concreteGrade,
		decimal steelQuantityKg,
		decimal formworkAreaM2 = 0m,
		SteelGrade steelGrade = SteelGrade.CA50,
		FormworkMaterial formworkMaterial = FormworkMaterial.CompensadoPlastificado,
		int formworkReuses = 12)
	{
		_elements.Add(new StructuralElement(
			name, StructuralElementType.Laje,
			concreteVolumeM3, concreteGrade,
			steelQuantityKg, steelGrade,
			formworkAreaM2, formworkMaterial, formworkReuses));
		return this;
	}

	/// <summary>
	/// Adiciona um elemento de fundação (sapata, bloco, estaca, tubulão ou radier).
	/// </summary>
	public FloorBuilder AddFundacao(
		string name,
		StructuralElementType elementType,
		decimal concreteVolumeM3,
		ConcreteGrade concreteGrade,
		decimal steelQuantityKg,
		decimal formworkAreaM2 = 0m,
		SteelGrade steelGrade = SteelGrade.CA50,
		FormworkMaterial formworkMaterial = FormworkMaterial.CompensadoPlastificado,
		int formworkReuses = 12)
	{
		_elements.Add(new StructuralElement(
			name, elementType,
			concreteVolumeM3, concreteGrade,
			steelQuantityKg, steelGrade,
			formworkAreaM2, formworkMaterial, formworkReuses));
		return this;
	}

	/// <summary>Constrói o Floor imutável.</summary>
	public Floor Build()
	{
		if (string.IsNullOrWhiteSpace(_name))
			throw new InvalidOperationException("Nome do pavimento é obrigatório.");
		if (_areaM2 <= 0)
			throw new InvalidOperationException("Área do pavimento deve ser maior que zero.");

		return new Floor(
			_name,
			_floorType,
			_floorHeightM,
			_areaM2,
			_elements.AsReadOnly(),
			_repetitionCount);
	}
}
