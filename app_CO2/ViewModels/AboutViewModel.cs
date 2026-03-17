namespace app_CO2.ViewModels;

public partial class AboutViewModel : ObservableObject
{
	public string AppName { get; } = "CO\u2082 Calculator";
	public string Version { get; } = "1.0";
	public string Description { get; } = "Calculadora de emiss\u00f5es de CO\u2082 para estruturas de concreto armado, baseada na CT 101 (IBRACON/ABECE/ABCIC, 2024).";
	public string Method { get; } = "CT 101 \u2014 M\u00e9todo para quantifica\u00e7\u00e3o das emiss\u00f5es de CO\u2082 em estruturas de concreto";
	public string Reference { get; } = "IBRACON/ABECE/ABCIC, 2024 \u2014 58 equa\u00e7\u00f5es para c\u00e1lculo de emiss\u00f5es nos est\u00e1gios A1-A3, A4, A5, B4, C1-C4";
}
