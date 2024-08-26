using StorageViewer.Models;

namespace StorageViewer.Services;

public class HistoryService: IHistoryService
{
    public IEnumerable<DataBlockModel> GetHistoryInformation(DateTimeOffset from, DateTimeOffset to)
    {
            // const int DEFAULT_PERIOD_MS = 24 * 60 * 60 * 1000;
            // long fromNormalizedMs = fromDate ?? (toDate ?? DEFAULT_PERIOD_MS) - DEFAULT_PERIOD_MS;
            // long toNormalizedMs = toDate ?? fromNormalizedMs + DEFAULT_PERIOD_MS;
            // long maxDate = Math.Max(fromNormalizedMs, toNormalizedMs);
            // long currentDate = Math.Min(fromNormalizedMs, toNormalizedMs);
            // DateTime unixDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            DateTimeOffset current = from;
            while (current < to)
            {
                yield return new DataBlockModel {
                    RecordTimestamp = current.ToString("u"),
                    DeviceId = "Dev1",
                    StoredData = new MeteoDataModel {
                        TemperatureInternal = Random.Shared.Next(15, 28),
                        HumidityInternal = Random.Shared.Next(25, 100),
                        PressureMmHg = Random.Shared.Next(750, 778),
                    }
                };
                current = current.AddDays(1);
            }
    }

}
