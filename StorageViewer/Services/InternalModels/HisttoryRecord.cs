internal class HistoryRecord
{
    public DateTimeOffset? MessageDate { get;set; }

    public string? DeviceId { get;set; }

    public HistoryIotData? IotData { get; set; }
}