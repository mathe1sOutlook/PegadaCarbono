using CoreCO2.Materials;

namespace CoreCO2.Building;

/// <summary>
/// Configuração de transporte do edifício por tipo de material.
/// Permite definir distâncias e modos de transporte específicos para cada material.
/// Valores não informados usam defaults do MaterialCatalog.GetDefaultTransport.
/// </summary>
/// <param name="ConcreteTransport">Transporte de concreto (betoneira). Default: 20 km, 0.096 kg CO₂/t.km.</param>
/// <param name="SteelTransport">Transporte de aço (truck 4 eixos). Default: 300 km, 0.066 kg CO₂/t.km.</param>
/// <param name="FormworkTransport">Transporte de fôrma (truck 4 eixos). Default: 500 km, 0.066 kg CO₂/t.km.</param>
/// <param name="WasteTransport">Transporte de resíduos (truck 3 eixos). Default: 60 km, 0.0601 kg CO₂/t.km.</param>
public record BuildingTransportConfig(
	TransportConfig? ConcreteTransport = null,
	TransportConfig? SteelTransport = null,
	TransportConfig? FormworkTransport = null,
	TransportConfig? WasteTransport = null)
{
	/// <summary>Obtém transporte efetivo para concreto (custom ou default).</summary>
	public TransportConfig EffectiveConcreteTransport =>
		ConcreteTransport ?? MaterialCatalog.GetDefaultTransport("Concreto");

	/// <summary>Obtém transporte efetivo para aço (custom ou default).</summary>
	public TransportConfig EffectiveSteelTransport =>
		SteelTransport ?? MaterialCatalog.GetDefaultTransport("Aco");

	/// <summary>Obtém transporte efetivo para fôrma (custom ou default).</summary>
	public TransportConfig EffectiveFormworkTransport =>
		FormworkTransport ?? MaterialCatalog.GetDefaultTransport("Compensado");

	/// <summary>Obtém transporte efetivo para resíduos (custom ou default).</summary>
	public TransportConfig EffectiveWasteTransport =>
		WasteTransport ?? MaterialCatalog.GetDefaultTransport("Residuo");
}
