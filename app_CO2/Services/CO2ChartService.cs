using CoreCO2.Abstractions;
using CoreCO2.Data;
using CoreCO2.Materials;
using CoreCO2.Models;
using CoreCO2.Reporting;
using OxyPlot;
using OxyPlot.Axes;
using OxyPlot.Legends;
using OxyPlot.Series;

namespace app_CO2.Services;

public class CO2ChartService(IEmissionFactorProvider factorProvider) : ICO2ChartService
{
	// ── Dark-mode friendly palette ──────────────────────────────────
	private static readonly OxyColor ChartBackground = OxyColor.FromArgb(0, 0, 0, 0);
	private static readonly OxyColor TextColor = OxyColor.FromRgb(210, 210, 210);
	private static readonly OxyColor GridColor = OxyColor.FromRgb(70, 70, 70);
	private static readonly OxyColor SubtleGrid = OxyColor.FromRgb(50, 50, 50);

	private static readonly OxyColor[] Palette =
	[
		OxyColor.FromRgb(76, 175, 80),   // Green 400
		OxyColor.FromRgb(100, 181, 246), // Blue 300
		OxyColor.FromRgb(255, 183, 77),  // Amber 300
		OxyColor.FromRgb(239, 83, 80),   // Red 300
		OxyColor.FromRgb(149, 117, 205), // Purple 300
		OxyColor.FromRgb(77, 208, 225),  // Cyan 300
		OxyColor.FromRgb(161, 136, 127), // Brown 300
		OxyColor.FromRgb(255, 138, 101), // Deep Orange 300
		OxyColor.FromRgb(220, 231, 117), // Lime 300
		OxyColor.FromRgb(240, 98, 146),  // Pink 300
	];

	// ── Existing charts (improved) ──────────────────────────────────

	public PlotModel CreateConcreteGradeChart()
	{
		var model = CreateBaseModel("Emissão por Classe de Concreto");

		var minSeries = new BarSeries
		{
			Title = "Mínimo",
			FillColor = Palette[0],
			StrokeThickness = 0,
			TrackerFormatString = "{0}\n{1}: {2}\nMínimo: {4:N0} kgCO₂/m³",
		};
		var maxSeries = new BarSeries
		{
			Title = "Máximo",
			FillColor = Palette[1],
			StrokeThickness = 0,
			TrackerFormatString = "{0}\n{1}: {2}\nMáximo: {4:N0} kgCO₂/m³",
		};

		var categoryAxis = new CategoryAxis
		{
			Position = AxisPosition.Left,
			TextColor = TextColor,
			TicklineColor = GridColor,
		};
		var valueAxis = CreateValueAxis("kgCO₂/m³", AxisPosition.Bottom);

		foreach (ConcreteGrade grade in Enum.GetValues<ConcreteGrade>())
		{
			EmissionFactor factor = MaterialCatalog.ConcreteFactors[grade];
			categoryAxis.Labels.Add(grade.ToString());
			minSeries.Items.Add(new BarItem((double)factor.ValueMin));
			maxSeries.Items.Add(new BarItem((double)factor.ValueMax));
		}

		model.Axes.Add(categoryAxis);
		model.Axes.Add(valueAxis);
		model.Series.Add(minSeries);
		model.Series.Add(maxSeries);
		return model;
	}

	public PlotModel CreateLifecycleBreakdownChart(BuildingCO2Report report)
	{
		var model = CreateBaseModel("Ciclo de Vida — kgCO₂/m²");

		var categoryAxis = new CategoryAxis
		{
			Position = AxisPosition.Left,
			TextColor = TextColor,
			TicklineColor = GridColor,
			Labels = { "A1-A3 (Produto)", "A4 (Transporte)", "A5 (Construção)" }
		};
		var valueAxis = CreateValueAxis("kgCO₂/m²", AxisPosition.Bottom);

		var minSeries = new BarSeries
		{
			Title = "Mínimo", FillColor = Palette[0], StrokeThickness = 0,
			TrackerFormatString = "{0}\n{1}: {2}\nMínimo: {4:N2} kgCO₂/m²",
		};
		var maxSeries = new BarSeries
		{
			Title = "Máximo", FillColor = Palette[1], StrokeThickness = 0,
			TrackerFormatString = "{0}\n{1}: {2}\nMáximo: {4:N2} kgCO₂/m²",
		};

		minSeries.Items.Add(new BarItem((double)report.A1A3MinKgCO2PerM2));
		minSeries.Items.Add(new BarItem((double)report.A4KgCO2PerM2));
		minSeries.Items.Add(new BarItem((double)report.A5MinKgCO2PerM2));

		maxSeries.Items.Add(new BarItem((double)report.A1A3MaxKgCO2PerM2));
		maxSeries.Items.Add(new BarItem((double)report.A4KgCO2PerM2));
		maxSeries.Items.Add(new BarItem((double)report.A5MaxKgCO2PerM2));

		model.Axes.Add(categoryAxis);
		model.Axes.Add(valueAxis);
		model.Series.Add(minSeries);
		model.Series.Add(maxSeries);
		return model;
	}

	public PlotModel CreateMaterialPieChart(BuildingCO2Report report)
	{
		var model = CreateBaseModel("Contribuição por Material");

		var pieSeries = new PieSeries
		{
			StrokeThickness = 1,
			Stroke = OxyColor.FromRgb(40, 40, 40),
			InsideLabelPosition = 0.5,
			InsideLabelColor = OxyColors.White,
			FontSize = 12,
			TrackerFormatString = "{1}: {2:N1}%",
		};

		pieSeries.Slices.Add(new PieSlice("Concreto", (double)report.ConcreteContributionPercent) { Fill = Palette[0] });
		pieSeries.Slices.Add(new PieSlice("Aço", (double)report.SteelContributionPercent) { Fill = Palette[1] });
		pieSeries.Slices.Add(new PieSlice("Fôrmas", (double)report.FormworkContributionPercent) { Fill = Palette[2] });
		pieSeries.Slices.Add(new PieSlice("Transporte", (double)report.TransportContributionPercent) { Fill = Palette[3] });

		model.Series.Add(pieSeries);
		return model;
	}

	public PlotModel CreateSensitivityChart()
	{
		var model = CreateBaseModel("Sensibilidade — Volume de Concreto C30");

		var volumeAxis = CreateValueAxis("Volume (m³)", AxisPosition.Bottom, max: 100);
		var emissionAxis = CreateValueAxis("kgCO₂", AxisPosition.Left);

		EmissionFactor c30 = MaterialCatalog.ConcreteFactors[ConcreteGrade.C30];

		var minLine = new LineSeries
		{
			Title = "Mínimo",
			Color = Palette[0],
			StrokeThickness = 2.5,
			TrackerFormatString = "Volume: {2:N0} m³\nEmissão mín: {4:N0} kgCO₂",
		};
		var maxLine = new LineSeries
		{
			Title = "Máximo",
			Color = Palette[3],
			StrokeThickness = 2.5,
			TrackerFormatString = "Volume: {2:N0} m³\nEmissão máx: {4:N0} kgCO₂",
		};

		for (int v = 0; v <= 100; v += 5)
		{
			minLine.Points.Add(new DataPoint(v, (double)(c30.ValueMin * v)));
			maxLine.Points.Add(new DataPoint(v, (double)(c30.ValueMax * v)));
		}

		model.Axes.Add(volumeAxis);
		model.Axes.Add(emissionAxis);
		model.Series.Add(minLine);
		model.Series.Add(maxLine);
		return model;
	}

	public PlotModel CreateBenchmarkChart(decimal kgCO2PerM2)
	{
		var model = CreateBaseModel("Benchmark — kgCO₂/m²");

		var categoryAxis = new CategoryAxis
		{
			Position = AxisPosition.Left,
			TextColor = TextColor,
			TicklineColor = GridColor,
			Labels = { "Seu Projeto", "CT 101 Mín (~70)", "CT 101 Máx (~111)" }
		};
		var valueAxis = CreateValueAxis("kgCO₂/m²", AxisPosition.Bottom);

		var series = new BarSeries
		{
			StrokeThickness = 0,
			TrackerFormatString = "{1}: {2}\n{4:N1} kgCO₂/m²",
		};
		series.Items.Add(new BarItem((double)kgCO2PerM2) { Color = Palette[1] });
		series.Items.Add(new BarItem(70) { Color = Palette[0] });
		series.Items.Add(new BarItem(111) { Color = Palette[3] });

		model.Axes.Add(categoryAxis);
		model.Axes.Add(valueAxis);
		model.Series.Add(series);
		return model;
	}

	public PlotModel CreateFloorEmissionChart(BuildingCO2Report report)
	{
		var model = CreateBaseModel("Emissão por Pavimento");

		var categoryAxis = new CategoryAxis
		{
			Position = AxisPosition.Left,
			TextColor = TextColor,
			TicklineColor = GridColor,
		};
		var valueAxis = CreateValueAxis("kgCO₂", AxisPosition.Bottom);

		var minSeries = new BarSeries
		{
			Title = "Mínimo", FillColor = Palette[0], StrokeThickness = 0,
			TrackerFormatString = "{0}\n{1}: {2}\nMínimo: {4:N0} kgCO₂",
		};
		var maxSeries = new BarSeries
		{
			Title = "Máximo", FillColor = Palette[1], StrokeThickness = 0,
			TrackerFormatString = "{0}\n{1}: {2}\nMáximo: {4:N0} kgCO₂",
		};

		foreach (FloorCO2Report floor in report.FloorReports)
		{
			categoryAxis.Labels.Add(floor.FloorName);
			minSeries.Items.Add(new BarItem((double)floor.TotalEmissionMin));
			maxSeries.Items.Add(new BarItem((double)floor.TotalEmissionMax));
		}

		model.Axes.Add(categoryAxis);
		model.Axes.Add(valueAxis);
		model.Series.Add(minSeries);
		model.Series.Add(maxSeries);
		return model;
	}

	// ── New comparison charts ───────────────────────────────────────

	public PlotModel CreateTransportModeChart()
	{
		var model = CreateBaseModel("Emissão por Modo de Transporte");
		var labels = new Dictionary<TransportMode, string>
		{
			[TransportMode.Toco2Eixos] = "Toco 2 eixos",
			[TransportMode.Truck3Eixos] = "Truck 3 eixos",
			[TransportMode.Truck4Eixos] = "Truck 4 eixos",
			[TransportMode.Carreta5Eixos] = "Carreta 5 eixos",
			[TransportMode.Betoneira] = "Betoneira",
		};

		var categoryAxis = new CategoryAxis
		{
			Position = AxisPosition.Left,
			TextColor = TextColor,
			TicklineColor = GridColor,
		};
		var valueAxis = CreateValueAxis("kgCO₂ / t·km", AxisPosition.Bottom);

		var series = new BarSeries
		{
			StrokeThickness = 0,
			TrackerFormatString = "{1}: {2}\n{4:N4} kgCO₂/t·km",
		};

		int colorIdx = 0;
		foreach (TransportMode mode in Enum.GetValues<TransportMode>())
		{
			EmissionFactor factor = TransportEmissionFactors.All[mode];
			categoryAxis.Labels.Add(labels.GetValueOrDefault(mode, mode.ToString()));
			series.Items.Add(new BarItem((double)factor.ValueMin) { Color = Palette[colorIdx % Palette.Length] });
			colorIdx++;
		}

		model.Axes.Add(categoryAxis);
		model.Axes.Add(valueAxis);
		model.Series.Add(series);
		return model;
	}

	public PlotModel CreateFuelComparisonChart()
	{
		var model = CreateBaseModel("Emissão por Combustível Fóssil (CT 101, Tabela 2)");
		var labels = new Dictionary<FuelType, string>
		{
			[FuelType.OleoDiesel] = "Óleo diesel",
			[FuelType.GasNatural] = "Gás natural",
			[FuelType.GLP] = "GLP",
			[FuelType.GasolinaAutomotiva] = "Gasolina",
			[FuelType.CarvaoMineral] = "Carvão mineral",
			[FuelType.CoqueCarvaoMineral] = "Coque carvão mineral",
			[FuelType.CoquePetroleo] = "Coque petróleo",
			[FuelType.OleoCombustivel] = "Óleo combustível",
			[FuelType.LenhaNaoRenovavel] = "Lenha não renovável",
			[FuelType.ResiduoPneu] = "Resíduo pneu",
			[FuelType.ResiduoPlastico] = "Resíduo plástico",
			[FuelType.ResiduosOleo] = "Resíduos óleo",
			[FuelType.CarvaoVegetalNaoRenovavel] = "Carvão vegetal (NR)",
		};

		var categoryAxis = new CategoryAxis
		{
			Position = AxisPosition.Left,
			TextColor = TextColor,
			TicklineColor = GridColor,
			FontSize = 11,
		};
		var valueAxis = CreateValueAxis("kgCO₂ / unidade", AxisPosition.Bottom);

		var series = new BarSeries
		{
			StrokeThickness = 0,
			TrackerFormatString = "{1}: {2}\n{4:N2} kgCO₂",
		};

		int colorIdx = 0;
		foreach (FuelType fuel in Enum.GetValues<FuelType>())
		{
			EmissionFactor factor = FuelEmissionFactors.All[fuel];
			// Skip renewable fuels (emission = 0) — focus on fossil polluters
			if (factor.ValueMin == 0) continue;
			// Skip Lenha (366 kg CO₂/st) — would distort the scale
			if (fuel == FuelType.LenhaNaoRenovavel) continue;

			categoryAxis.Labels.Add(labels.GetValueOrDefault(fuel, fuel.ToString()));
			series.Items.Add(new BarItem((double)factor.ValueMin) { Color = Palette[colorIdx % Palette.Length] });
			colorIdx++;
		}

		model.Axes.Add(categoryAxis);
		model.Axes.Add(valueAxis);
		model.Series.Add(series);
		return model;
	}

	public PlotModel CreateCarbonateComparisonChart()
	{
		var model = CreateBaseModel("Emissão por Carbonato (CT 101, Tabela 3 — 100% calcinação)");
		var labels = new Dictionary<CarbonateType, string>
		{
			[CarbonateType.Calcite] = "Calcita (CaCO₃)",
			[CarbonateType.Magnesite] = "Magnesita (MgCO₃)",
			[CarbonateType.Dolomite] = "Dolomita",
			[CarbonateType.Siderite] = "Siderita (FeCO₃)",
			[CarbonateType.Rhodochrosite] = "Rodocrosita (MnCO₃)",
			[CarbonateType.SodiumCarbonate] = "Carbonato de sódio",
		};

		var categoryAxis = new CategoryAxis
		{
			Position = AxisPosition.Left,
			TextColor = TextColor,
			TicklineColor = GridColor,
		};
		var valueAxis = CreateValueAxis("kgCO₂ / kg", AxisPosition.Bottom);

		var minSeries = new BarSeries
		{
			Title = "Mínimo", StrokeThickness = 0, FillColor = Palette[0],
			TrackerFormatString = "{0}\n{1}: {2}\nMínimo: {4:N2} kgCO₂/kg",
		};
		var maxSeries = new BarSeries
		{
			Title = "Máximo", StrokeThickness = 0, FillColor = Palette[1],
			TrackerFormatString = "{0}\n{1}: {2}\nMáximo: {4:N2} kgCO₂/kg",
		};

		foreach (CarbonateType carb in Enum.GetValues<CarbonateType>())
		{
			EmissionFactor factor = CarbonateEmissionFactors.All[carb];
			categoryAxis.Labels.Add(labels.GetValueOrDefault(carb, carb.ToString()));
			minSeries.Items.Add(new BarItem((double)factor.ValueMin));
			maxSeries.Items.Add(new BarItem((double)factor.ValueMax));
		}

		model.Axes.Add(categoryAxis);
		model.Axes.Add(valueAxis);
		model.Series.Add(minSeries);
		model.Series.Add(maxSeries);
		return model;
	}

	public PlotModel CreateFormworkComparisonChart()
	{
		var model = CreateBaseModel("Emissão por Material de Fôrma");
		var labels = new Dictionary<FormworkMaterial, string>
		{
			[FormworkMaterial.CompensadoPlastificado] = "Compensado plastificado",
			[FormworkMaterial.MadeiraSerradaBruta] = "Madeira serrada bruta",
			[FormworkMaterial.Metalica] = "Metálica (reutilizável)",
		};

		var categoryAxis = new CategoryAxis
		{
			Position = AxisPosition.Left,
			TextColor = TextColor,
			TicklineColor = GridColor,
		};
		var valueAxis = CreateValueAxis("kgCO₂ / unidade", AxisPosition.Bottom);

		var minSeries = new BarSeries
		{
			Title = "Mínimo", StrokeThickness = 0, FillColor = Palette[0],
			TrackerFormatString = "{0}\n{1}: {2}\nMínimo: {4:N1} kgCO₂",
		};
		var maxSeries = new BarSeries
		{
			Title = "Máximo", StrokeThickness = 0, FillColor = Palette[1],
			TrackerFormatString = "{0}\n{1}: {2}\nMáximo: {4:N1} kgCO₂",
		};

		foreach (FormworkMaterial mat in Enum.GetValues<FormworkMaterial>())
		{
			EmissionFactor factor = MaterialCatalog.FormworkFactors[mat];
			categoryAxis.Labels.Add(labels.GetValueOrDefault(mat, mat.ToString()));
			minSeries.Items.Add(new BarItem((double)factor.ValueMin));
			maxSeries.Items.Add(new BarItem((double)factor.ValueMax));
		}

		model.Axes.Add(categoryAxis);
		model.Axes.Add(valueAxis);
		model.Series.Add(minSeries);
		model.Series.Add(maxSeries);
		return model;
	}

	public PlotModel CreateElectricityContextChart()
	{
		var model = CreateBaseModel("Emissão — Eletricidade vs. Combustíveis (por MWh equivalente)");

		// Compare electricity grid (0.07 kgCO₂/kWh = 70 kgCO₂/MWh) vs fossil fuel equivalents
		// Diesel: ~2.29 kgCO₂/L, ~10.1 kWh/L → ~227 kgCO₂/MWh
		// Natural gas: ~2.74 kgCO₂/m³, ~10.5 kWh/m³ → ~261 kgCO₂/MWh
		// Coal: ~2.28 kgCO₂/kg, ~7.5 kWh/kg → ~304 kgCO₂/MWh
		var categoryAxis = new CategoryAxis
		{
			Position = AxisPosition.Left,
			TextColor = TextColor,
			TicklineColor = GridColor,
			Labels =
			{
				"Rede elétrica BR",
				"Óleo diesel",
				"Gás natural",
				"Carvão mineral",
				"Coque petróleo",
			}
		};
		var valueAxis = CreateValueAxis("kgCO₂ / MWh (equiv.)", AxisPosition.Bottom);

		var series = new BarSeries
		{
			StrokeThickness = 0,
			TrackerFormatString = "{1}: {2}\n{4:N0} kgCO₂/MWh",
		};

		series.Items.Add(new BarItem(70) { Color = Palette[0] });     // Grid BR
		series.Items.Add(new BarItem(227) { Color = Palette[3] });    // Diesel
		series.Items.Add(new BarItem(261) { Color = Palette[2] });    // Natural gas
		series.Items.Add(new BarItem(304) { Color = Palette[7] });    // Coal
		series.Items.Add(new BarItem(380) { Color = Palette[9] });    // Petroleum coke

		model.Axes.Add(categoryAxis);
		model.Axes.Add(valueAxis);
		model.Series.Add(series);
		return model;
	}

	// ── Helpers ──────────────────────────────────────────────────────

	private static LinearAxis CreateValueAxis(string title, AxisPosition position, double? max = null)
	{
		var axis = new LinearAxis
		{
			Position = position,
			Title = title,
			Minimum = 0,
			TextColor = TextColor,
			TitleColor = TextColor,
			TicklineColor = GridColor,
			MajorGridlineStyle = LineStyle.Solid,
			MajorGridlineColor = GridColor,
			MinorGridlineStyle = LineStyle.Dot,
			MinorGridlineColor = SubtleGrid,
		};
		if (max.HasValue) axis.Maximum = max.Value;
		return axis;
	}

	private static PlotModel CreateBaseModel(string title)
	{
		var model = new PlotModel
		{
			Title = title,
			TitleColor = TextColor,
			TitleFontSize = 14,
			TitleFontWeight = 600,
			Background = ChartBackground,
			PlotAreaBorderColor = GridColor,
			Padding = new OxyThickness(8),
		};
		model.Legends.Add(new Legend
		{
			LegendPosition = LegendPosition.TopRight,
			LegendPlacement = LegendPlacement.Outside,
			LegendOrientation = LegendOrientation.Horizontal,
			LegendTextColor = TextColor,
			LegendBackground = OxyColor.FromArgb(0, 0, 0, 0),
			LegendBorder = OxyColors.Transparent,
		});
		return model;
	}
}
