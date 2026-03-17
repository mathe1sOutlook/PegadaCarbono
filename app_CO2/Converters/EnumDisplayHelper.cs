namespace app_CO2.Converters;

public static class EnumDisplayHelper
{
	private static readonly Dictionary<string, string> Translations = new()
	{
		// FloorType
		["Foundation"] = "Fundação",
		["Infrastructure"] = "Infraestrutura",
		["GroundFloor"] = "Térreo",
		["TypicalFloor"] = "Pavimento Tipo",
		["Roof"] = "Cobertura",
		["Attic"] = "Ático",
		["UpperReservoir"] = "Reservatório Superior",
		["LowerReservoir"] = "Reservatório Inferior",
		// StructuralElementType
		["Pilar"] = "Pilar",
		["Viga"] = "Viga",
		["Laje"] = "Laje",
		["Sapata"] = "Sapata",
		["BlocoFundacao"] = "Bloco de Fundação",
		["Tubulao"] = "Tubulão",
		["Estaca"] = "Estaca",
		["Radier"] = "Radier",
		// TransportMode
		["Toco2Eixos"] = "Toco (2 eixos)",
		["Truck3Eixos"] = "Truck (3 eixos)",
		["Truck4Eixos"] = "Truck (4 eixos)",
		["Carreta5Eixos"] = "Carreta (5 eixos)",
		["Betoneira"] = "Betoneira",
		// ConcreteGrade
		["C20"] = "C20",
		["C25"] = "C25",
		["C30"] = "C30",
		["C35"] = "C35",
		["C40"] = "C40",
		["C45"] = "C45",
		["C50"] = "C50",
		// SteelGrade
		["CA50"] = "CA-50",
		["CA60"] = "CA-60",
		// FormworkMaterial
		["CompensadoPlastificado"] = "Compensado Plastificado",
		["MadeiraSerradaBruta"] = "Madeira Serrada Bruta",
		["Metalica"] = "Metálica",
		// FuelType
		["AlcoolEtilicoHidratado"] = "Álcool etílico hidratado",
		["CarvaoMineral"] = "Carvão mineral",
		["CarvaoVegetalNaoRenovavel"] = "Carvão vegetal (não renovável)",
		["CarvaoVegetalRenovavel"] = "Carvão vegetal (renovável)",
		["CoqueCarvaoMineral"] = "Coque de carvão mineral",
		["CoquePetroleo"] = "Coque de petróleo",
		["GLP"] = "GLP",
		["GasNatural"] = "Gás natural",
		["GasolinaAutomotiva"] = "Gasolina automotiva",
		["LenhaNaoRenovavel"] = "Lenha (não renovável)",
		["LenhaRenovavel"] = "Lenha (renovável)",
		["OleoCombustivel"] = "Óleo combustível",
		["OleoDiesel"] = "Óleo diesel",
		["ResiduosMadeiraRenovavel"] = "Resíduos de madeira (renovável)",
		["ResiduosOleo"] = "Resíduos de óleo",
		["ResiduoPneu"] = "Resíduo de pneu",
		["ResiduoPlastico"] = "Resíduo plástico",
		// CarbonateType
		["Calcite"] = "Calcita (CaCO₃)",
		["Magnesite"] = "Magnesita (MgCO₃)",
		["Dolomite"] = "Dolomita (CaMg(CO₃)₂)",
		["Siderite"] = "Siderita (FeCO₃)",
		["Ankerite"] = "Anquerita (Ca(Fe,Mg,Mn)(CO₃)₂)",
		["Rhodochrosite"] = "Rodocrosita (MnCO₃)",
		["SodiumCarbonate"] = "Carbonato de sódio (Na₂CO₃)",
	};

	public static string GetDisplayName(string enumValue)
		=> Translations.TryGetValue(enumValue, out string? translated) ? translated : enumValue;
}
