namespace app_CO2.WinUI
{
	public partial class App : MauiWinUIApplication
	{
		public App()
		{
			this.InitializeComponent();
			Microsoft.UI.Xaml.Application.Current.UnhandledException += (sender, args) => 
			{
				System.IO.File.WriteAllText("crash_log.txt", args.Exception.ToString() + "\n\nMessage: " + args.Message);
			};
		}

		protected override MauiApp CreateMauiApp() => MauiProgram.CreateMauiApp();
	}
}
