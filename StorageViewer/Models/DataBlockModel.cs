using System.Text.Json.Serialization;

namespace StorageViewer.Models;

public class DataBlockModel
{
    [JsonIgnore]
    public DateTimeOffset? NativeTimeStamp { get; set; }

    public bool PreviousEntityMissed { get; set; } = false;

    public required string RecordTimestamp { get; set; }

    public required string DeviceId { get; set; }

    public required MeteoDataModel StoredData { get; set; }
}
