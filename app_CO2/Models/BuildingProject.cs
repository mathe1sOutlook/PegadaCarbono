namespace app_CO2.Models;

public class BuildingProject
{
	public string Id { get; set; } = Guid.NewGuid().ToString();
	public string Name { get; set; } = string.Empty;
	public string Description { get; set; } = string.Empty;
	public int ReferenceServiceLifeYears { get; set; } = 50;
	public List<BuildingFloorDto> Floors { get; set; } = [];
	public TransportConfigDto Transport { get; set; } = new();
	public ConstructionConfigDto Construction { get; set; } = new();
	public DateTime CreatedAt { get; set; } = DateTime.Now;
	public DateTime UpdatedAt { get; set; } = DateTime.Now;

	/// <summary>
	/// Converts this DTO into the CoreCO2 domain <see cref="Building"/> record
	/// suitable for <see cref="IBuildingCO2Service.Calculate"/>.
	/// </summary>
	public Building ToBuilding()
	{
		var transportConfig = new BuildingTransportConfig(
			ConcreteTransport: new TransportConfig(TransportMode.Betoneira, Transport.ConcreteDistanceKm, 0.096m),
			SteelTransport: new TransportConfig(TransportMode.Truck4Eixos, Transport.SteelDistanceKm, 0.066m),
			FormworkTransport: new TransportConfig(TransportMode.Truck4Eixos, Transport.FormworkDistanceKm, 0.066m),
			WasteTransport: new TransportConfig(TransportMode.Truck3Eixos, Transport.WasteDistanceKm, 0.0601m));

		var constructionConfig = new ConstructionConfig(
			ConcreteLossPercent: Construction.ConcreteLossPercent,
			SteelLossPercent: Construction.SteelLossPercent,
			FormworkLossPercent: Construction.FormworkLossPercent,
			DieselPerM3Concrete: Construction.DieselConsumptionLPerM3);

		List<Floor> floors = Floors.Select(f =>
		{
			FloorType floorType = Enum.Parse<FloorType>(f.FloorType);
			List<StructuralElement> elements = f.Elements.Select(e =>
				new StructuralElement(
					e.Name,
					Enum.Parse<StructuralElementType>(e.ElementType),
					e.ConcreteVolume,
					Enum.Parse<ConcreteGrade>(e.ConcreteGrade),
					e.SteelMass,
					Enum.Parse<SteelGrade>(e.SteelGrade),
					e.FormworkArea,
					Enum.Parse<FormworkMaterial>(e.FormworkMaterial),
					e.FormworkReuses)).ToList();

			return new Floor(f.Name, floorType, f.FloorHeight, f.FloorArea, elements, f.RepetitionCount);
		}).ToList();

		return new Building(Name, floors, transportConfig, constructionConfig, Description, ReferenceServiceLifeYears);
	}
}

public class BuildingFloorDto
{
	public string Name { get; set; } = string.Empty;
	public string FloorType { get; set; } = "TypicalFloor";
	public decimal FloorHeight { get; set; } = 3.0m;
	public decimal FloorArea { get; set; }
	public int RepetitionCount { get; set; } = 1;
	public List<BuildingElementDto> Elements { get; set; } = [];
}

public class BuildingElementDto
{
	public string Name { get; set; } = string.Empty;
	public string ElementType { get; set; } = "Pilar";
	public decimal ConcreteVolume { get; set; }
	public string ConcreteGrade { get; set; } = "C30";
	public decimal SteelMass { get; set; }
	public string SteelGrade { get; set; } = "CA50";
	public decimal FormworkArea { get; set; }
	public string FormworkMaterial { get; set; } = "CompensadoPlastificado";
	public int FormworkReuses { get; set; } = 12;
}

public class TransportConfigDto
{
	public decimal ConcreteDistanceKm { get; set; } = 20;
	public decimal SteelDistanceKm { get; set; } = 300;
	public decimal FormworkDistanceKm { get; set; } = 100;
	public decimal WasteDistanceKm { get; set; } = 30;
}

public class ConstructionConfigDto
{
	public decimal ConcreteLossPercent { get; set; } = 10;
	public decimal SteelLossPercent { get; set; } = 10;
	public decimal FormworkLossPercent { get; set; } = 5;
	public decimal DieselConsumptionLPerM3 { get; set; } = 2.66m;
}
