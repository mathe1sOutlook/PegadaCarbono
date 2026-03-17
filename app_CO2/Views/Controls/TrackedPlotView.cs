using OxyPlot;
using OxyPlot.Maui.Skia;

namespace app_CO2.Views.Controls;

/// <summary>
/// PlotView with mouse hover tracking on Windows desktop.
/// OxyPlot.Maui.Skia only forwards touch events — this bridges MAUI's
/// PointerGestureRecognizer to OxyPlot's mouse-based controller pipeline
/// so the tracker tooltip works on hover.
/// </summary>
public class TrackedPlotView : PlotView
{
	public TrackedPlotView()
	{
		Controller = CreateHoverController();

		var pgr = new PointerGestureRecognizer();
		pgr.PointerEntered += OnPointerEntered;
		pgr.PointerMoved += OnPointerMoved;
		pgr.PointerExited += OnPointerExited;
		GestureRecognizers.Add(pgr);
	}

	private void OnPointerEntered(object? sender, PointerEventArgs e)
		=> Controller?.HandleMouseEnter(this, ToOxy(e));

	private void OnPointerMoved(object? sender, PointerEventArgs e)
		=> Controller?.HandleMouseMove(this, ToOxy(e));

	private void OnPointerExited(object? sender, PointerEventArgs e)
		=> Controller?.HandleMouseLeave(this, new OxyMouseEventArgs());

	private OxyMouseEventArgs ToOxy(PointerEventArgs e)
	{
		var pos = e.GetPosition(this);
		return new OxyMouseEventArgs
		{
			Position = pos.HasValue
				? new ScreenPoint(pos.Value.X, pos.Value.Y)
				: default
		};
	}

	private static IPlotController CreateHoverController()
	{
		// Use the MAUI PlotController (keeps touch bindings + mouse wheel zoom),
		// then add the mouse-enter hover tracking from OxyPlot core.
		var c = new OxyPlot.Maui.Skia.PlotController();
		c.BindMouseEnter(OxyPlot.PlotCommands.HoverSnapTrack);
		return c;
	}
}
