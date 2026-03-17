namespace CoreCO2.Models;

/// <summary>
/// Módulos de informação do ciclo de vida conforme EN 15978 / ISO 21930.
/// </summary>
public enum LifeCycleModule
{
	/// <summary>Extração e processamento de matérias-primas.</summary>
	A1,
	/// <summary>Transporte de matérias-primas até a fábrica.</summary>
	A2,
	/// <summary>Fabricação do produto.</summary>
	A3,
	/// <summary>Transporte do produto até a obra.</summary>
	A4,
	/// <summary>Processo construtivo na obra.</summary>
	A5,
	/// <summary>Uso.</summary>
	B1,
	/// <summary>Manutenção.</summary>
	B2,
	/// <summary>Reparo.</summary>
	B3,
	/// <summary>Substituição.</summary>
	B4,
	/// <summary>Renovação.</summary>
	B5,
	/// <summary>Demolição/desconstrução.</summary>
	C1,
	/// <summary>Transporte de resíduos.</summary>
	C2,
	/// <summary>Processamento de resíduos para reciclagem.</summary>
	C3,
	/// <summary>Disposição final.</summary>
	C4,
	/// <summary>Benefícios além da fronteira do sistema.</summary>
	D
}

/// <summary>
/// Categorias de emissão de CO₂ (Equação 6 do CT 101).
/// </summary>
public enum EmissionCategory
{
	/// <summary>Queima de combustíveis fósseis (C_comb).</summary>
	FuelCombustion,
	/// <summary>Decomposição de carbonatos (C_calc).</summary>
	CarbonateCalcination,
	/// <summary>Queima/decomposição de biomassa não renovável (C_biomassa,nr).</summary>
	NonRenewableBiomass,
	/// <summary>Emissões incorporadas aos materiais processados (C_mp).</summary>
	ProcessedMaterial,
	/// <summary>Emissões da geração de energia elétrica (C_elet).</summary>
	Electricity,
	/// <summary>Emissões de transporte (C_transp).</summary>
	Transport,
	/// <summary>Emissões de disposição de resíduos (C_res).</summary>
	WasteDisposal,
	/// <summary>Remoção de CO₂ por carbonatação (-C_carb).</summary>
	Carbonation
}

/// <summary>
/// Tipos de combustíveis fósseis conforme Tabela 2 do CT 101.
/// </summary>
public enum FuelType
{
	AlcoolEtilicoHidratado,
	CarvaoMineral,
	CarvaoVegetalNaoRenovavel,
	CarvaoVegetalRenovavel,
	CoqueCarvaoMineral,
	CoquePetroleo,
	GLP,
	GasNatural,
	GasolinaAutomotiva,
	LenhaNaoRenovavel,
	LenhaRenovavel,
	OleoCombustivel,
	OleoDiesel,
	ResiduosMadeiraRenovavel,
	ResiduosOleo,
	ResiduoPneu,
	ResiduoPlastico
}

/// <summary>
/// Tipos de carbonatos conforme Tabela 3 do CT 101.
/// </summary>
public enum CarbonateType
{
	/// <summary>Calcita (CaCO₃) — 0.44 kg CO₂/kg.</summary>
	Calcite,
	/// <summary>Magnesita (MgCO₃) — 0.52 kg CO₂/kg.</summary>
	Magnesite,
	/// <summary>Dolomita (CaMg(CO₃)₂) — 0.48 kg CO₂/kg.</summary>
	Dolomite,
	/// <summary>Siderita (FeCO₃) — 0.38 kg CO₂/kg.</summary>
	Siderite,
	/// <summary>Ankerita (Ca(Fe,Mg,Mn)(CO₃)₂) — 0.41 a 0.48 kg CO₂/kg.</summary>
	Ankerite,
	/// <summary>Rodocrosita (MnCO₃) — 0.38 kg CO₂/kg.</summary>
	Rhodochrosite,
	/// <summary>Carbonato de sódio (Na₂CO₃) — 0.41 kg CO₂/kg.</summary>
	SodiumCarbonate
}

/// <summary>
/// Modos de transporte rodoviário conforme fatores Sidac.
/// </summary>
public enum TransportMode
{
	/// <summary>Caminhão toco (2 eixos).</summary>
	Toco2Eixos,
	/// <summary>Caminhão truck (3 eixos).</summary>
	Truck3Eixos,
	/// <summary>Caminhão truck (4 eixos).</summary>
	Truck4Eixos,
	/// <summary>Caminhão carreta (5 eixos).</summary>
	Carreta5Eixos,
	/// <summary>Caminhão betoneira (transporte de concreto).</summary>
	Betoneira
}

/// <summary>
/// Tipo de fluxo no inventário de ciclo de vida.
/// </summary>
public enum InventoryFlowType
{
	Input,
	Output,
	Product
}
