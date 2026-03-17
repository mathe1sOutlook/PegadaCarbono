namespace CoreCO2.Models;

/// <summary>
/// Entrada ou saída do inventário de ciclo de vida (Quadro 3 do CT 101).
/// </summary>
/// <param name="ItemName">Nome do item (ex.: "Cimento CP II F", "Areia", "Óleo diesel").</param>
/// <param name="Category">Categoria de emissão associada.</param>
/// <param name="FlowType">Tipo de fluxo (entrada, saída, produto).</param>
/// <param name="Quantity">Quantidade por unidade funcional/declarada (UD/UF).</param>
/// <param name="DeclaredUnit">Unidade declarada (ex.: "kg", "L", "kWh", "m³").</param>
/// <param name="TransportMode">Modo de transporte (null se não aplicável).</param>
/// <param name="TransportDistanceKm">Distância de transporte em km (ida e volta se aplicável).</param>
/// <param name="MassConversionFactor">Fator de conversão para massa em kg (kg/UD). Para kg=1, para L depende da densidade.</param>
/// <param name="DisposalEmissionFactor">Fator de emissão para disposição de resíduos (kg CO₂/kg). Eq. 19/55. Aplicável a saídas (outputs). Default 0.</param>
public record InventoryEntry(
	string ItemName,
	EmissionCategory Category,
	InventoryFlowType FlowType,
	decimal Quantity,
	string DeclaredUnit,
	TransportMode? TransportMode = null,
	decimal TransportDistanceKm = 0m,
	decimal MassConversionFactor = 1m,
	decimal DisposalEmissionFactor = 0m);
