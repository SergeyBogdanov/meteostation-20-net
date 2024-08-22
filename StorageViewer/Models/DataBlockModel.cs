namespace StorageViewer.Models;

public class DataBlockModel
{
    public required string RecordTimestamp { get; set; }

    public required string DeviceId { get; set; }

    public required MeteoDataModel StoredData { get; set; }
}
