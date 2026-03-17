namespace app_CO2.ViewModels;

public partial class UnifiedCalculatorViewModel(
	ConcreteCalculatorViewModel concrete,
	SteelCalculatorViewModel steel,
	FormworkCalculatorViewModel formwork,
	TransportCalculatorViewModel transport,
	HistoryPanelViewModel historyPanel) : ObservableObject
{
	public ConcreteCalculatorViewModel Concrete { get; } = concrete;
	public SteelCalculatorViewModel Steel { get; } = steel;
	public FormworkCalculatorViewModel Formwork { get; } = formwork;
	public TransportCalculatorViewModel Transport { get; } = transport;
	public HistoryPanelViewModel HistoryPanel { get; } = historyPanel;

	[ObservableProperty]
	private int _selectedTab;
}
