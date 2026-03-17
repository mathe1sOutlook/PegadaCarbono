using app_CO2.Models;
using CommunityToolkit.Mvvm.Messaging.Messages;

namespace app_CO2.Messages;

public sealed class HistoryItemAddedMessage(HistoryItem item) : ValueChangedMessage<HistoryItem>(item);
public sealed class HistoryItemRemovedMessage(string itemId) : ValueChangedMessage<string>(itemId);
public sealed class FactorOverrideChangedMessage(UserFactorOverride factor) : ValueChangedMessage<UserFactorOverride>(factor);
