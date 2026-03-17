using CoreCO2.Abstractions;
using CoreCO2.Models;

namespace CoreCO2.Services;

/// <summary>
/// Validador de inventário conforme critérios do CT 101 seção 8.2.
/// </summary>
public sealed class InventoryValidator : IInventoryValidator
{
	/// <inheritdoc />
	public bool ValidateMassBalance(Inventory inventory, decimal tolerancePercent = 0.01m)
	{
		ArgumentNullException.ThrowIfNull(inventory);

		decimal inputMass = inventory.Inputs
			.Sum(e => e.Quantity * e.MassConversionFactor);

		decimal outputMass = inventory.Outputs
			.Sum(e => e.Quantity * e.MassConversionFactor)
			+ inventory.Products
			.Sum(e => e.Quantity * e.MassConversionFactor);

		if (inputMass == 0m && outputMass == 0m)
			return true;

		decimal maxMass = Math.Max(inputMass, outputMass);
		decimal difference = Math.Abs(inputMass - outputMass);

		return difference / maxMass <= tolerancePercent;
	}

	/// <inheritdoc />
	public IReadOnlyList<string> GetCutoffEligibleItems(Inventory inventory)
	{
		ArgumentNullException.ThrowIfNull(inventory);

		decimal totalInputMass = inventory.Inputs
			.Sum(e => e.Quantity * e.MassConversionFactor);

		if (totalInputMass <= 0m)
			return [];

		var candidates = new List<(string name, decimal fraction)>();

		foreach (var entry in inventory.Inputs)
		{
			decimal itemMass = entry.Quantity * entry.MassConversionFactor;
			decimal fraction = itemMass / totalInputMass;

			if (fraction < 0.01m)
				candidates.Add((entry.ItemName, fraction));
		}

		// A soma dos itens omitidos não pode exceder 5%
		decimal cumulativeFraction = 0m;
		var eligible = new List<string>();

		foreach (var (name, fraction) in candidates.OrderBy(c => c.fraction))
		{
			if (cumulativeFraction + fraction <= 0.05m)
			{
				eligible.Add(name);
				cumulativeFraction += fraction;
			}
		}

		return eligible;
	}
}
