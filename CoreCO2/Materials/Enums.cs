namespace CoreCO2.Materials;

/// <summary>
/// Classes de resistência do concreto (fck em MPa).
/// </summary>
public enum ConcreteGrade
{
	C20 = 20,
	C25 = 25,
	C30 = 30,
	C35 = 35,
	C40 = 40,
	C45 = 45,
	C50 = 50
}

/// <summary>
/// Tipos de aço para concreto armado.
/// </summary>
public enum SteelGrade
{
	/// <summary>Vergalhão CA-50 (fy = 500 MPa).</summary>
	CA50,
	/// <summary>Fio CA-60 (fy = 600 MPa).</summary>
	CA60
}

/// <summary>
/// Materiais de fôrma para concreto armado.
/// </summary>
public enum FormworkMaterial
{
	/// <summary>Compensado plastificado (17 mm), uso típico com 12 reaproveitamentos.</summary>
	CompensadoPlastificado,
	/// <summary>Madeira serrada bruta (escoramento, sarrafos).</summary>
	MadeiraSerradaBruta,
	/// <summary>Fôrma/escoramento metálico (reutilizável muitas vezes).</summary>
	Metalica
}
