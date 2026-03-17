namespace CoreCO2.Building;

/// <summary>
/// Tipo de pavimento na hierarquia do edifício.
/// </summary>
public enum FloorType
{
	/// <summary>Fundação (sapatas, blocos, estacas, radier).</summary>
	Foundation,
	/// <summary>Infraestrutura (subterrâneo).</summary>
	Infrastructure,
	/// <summary>Pavimento térreo.</summary>
	GroundFloor,
	/// <summary>Pavimento tipo (pode ter repetições).</summary>
	TypicalFloor,
	/// <summary>Cobertura.</summary>
	Roof,
	/// <summary>Ático.</summary>
	Attic,
	/// <summary>Reservatório superior.</summary>
	UpperReservoir,
	/// <summary>Reservatório enterrado.</summary>
	LowerReservoir
}

/// <summary>
/// Tipo de elemento estrutural de concreto armado.
/// </summary>
public enum StructuralElementType
{
	/// <summary>Pilar (coluna).</summary>
	Pilar,
	/// <summary>Viga.</summary>
	Viga,
	/// <summary>Laje.</summary>
	Laje,
	/// <summary>Sapata (fundação superficial).</summary>
	Sapata,
	/// <summary>Bloco de fundação.</summary>
	BlocoFundacao,
	/// <summary>Tubulão (fundação profunda).</summary>
	Tubulao,
	/// <summary>Estaca (fundação profunda).</summary>
	Estaca,
	/// <summary>Radier (fundação em placa).</summary>
	Radier
}
