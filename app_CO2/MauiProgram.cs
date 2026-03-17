using CommunityToolkit.Maui;
using CoreCO2.Extensions;
using Microsoft.Extensions.Logging;
using SkiaSharp.Views.Maui.Controls.Hosting;
using Syncfusion.Maui.Toolkit.Hosting;
using app_CO2.Services;
using app_CO2.ViewModels;
using app_CO2.Views;

namespace app_CO2;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		MauiAppBuilder builder = MauiApp.CreateBuilder();
		builder
			.UseMauiApp<App>()
			.UseMauiCommunityToolkit()
			.ConfigureSyncfusionToolkit()
			.ConfigureEffects(effects => { })
			.UseSkiaSharp()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
				fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
				fonts.AddFont("SegoeUI-Semibold.ttf", "SegoeSemibold");
				fonts.AddFont("FluentSystemIcons-Regular.ttf", FluentUI.FontFamily);
			});

#if DEBUG
		builder.Logging.AddDebug();
		builder.Services.AddLogging(configure => configure.AddDebug());
#endif

		// CoreCO2 engine (registers ICO2CalculationService, IEmissionFactorProvider,
		// IInventoryValidator, IBuildingCO2Service, IBuildingComparisonService, IBuildingInventoryTranslator)
		builder.Services.AddCoreCO2();

		// App services
		builder.Services.AddSingleton<IHistoryService, HistoryService>();
		builder.Services.AddSingleton<IProjectService, ProjectService>();
		builder.Services.AddSingleton<IUserFactorService, UserFactorService>();
		builder.Services.AddSingleton<IExportService, ExportService>();
		builder.Services.AddSingleton<ICalculatorFacade, CalculatorFacade>();
		builder.Services.AddSingleton<ICO2ChartService, CO2ChartService>();

		// Singleton ViewModels (sidebar pages)
		builder.Services.AddSingleton<HistoryPanelViewModel>();
		builder.Services.AddSingleton<DashboardViewModel>();
		builder.Services.AddSingleton<ConcreteCalculatorViewModel>();
		builder.Services.AddSingleton<SteelCalculatorViewModel>();
		builder.Services.AddSingleton<FormworkCalculatorViewModel>();
		builder.Services.AddSingleton<TransportCalculatorViewModel>();
		builder.Services.AddSingleton<UnifiedCalculatorViewModel>();
		builder.Services.AddSingleton<BuildingProjectViewModel>();
		builder.Services.AddSingleton<FuelTableViewModel>();
		builder.Services.AddSingleton<CarbonateTableViewModel>();
		builder.Services.AddSingleton<TransportTableViewModel>();
		builder.Services.AddSingleton<MaterialTableViewModel>();
		builder.Services.AddSingleton<AboutViewModel>();

		// Transient ViewModels (detail pages)
		builder.Services.AddSingleton<BuildingReportViewModel>();

		// Pages
		builder.Services.AddSingleton<DashboardPage>();
		builder.Services.AddSingleton<ConcreteCalculatorPage>();
		builder.Services.AddSingleton<SteelCalculatorPage>();
		builder.Services.AddSingleton<FormworkCalculatorPage>();
		builder.Services.AddSingleton<TransportCalculatorPage>();
		builder.Services.AddSingleton<UnifiedCalculatorPage>();
		builder.Services.AddSingleton<BuildingProjectPage>();
		builder.Services.AddSingleton<FuelTablePage>();
		builder.Services.AddSingleton<CarbonateTablePage>();
		builder.Services.AddSingleton<TransportTablePage>();
		builder.Services.AddSingleton<MaterialTablePage>();
		builder.Services.AddSingleton<AboutPage>();
		builder.Services.AddTransient<BuildingReportPage>();

		Routing.RegisterRoute("building-report", typeof(BuildingReportPage));

		return builder.Build();
	}
}
