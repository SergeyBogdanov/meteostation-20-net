using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using StorageViewer.Models;

namespace StorageViewer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class HistoryController : ControllerBase
{
    private readonly ILogger<HistoryController> _logger;

    public HistoryController(ILogger<HistoryController> logger)
    {
        _logger = logger;
    }

    [HttpGet("all")]
    // public ActionResult<string[]> GetAllHistory()
    // {
    //     return new ActionResult<string[]>(["Some history item", "Other item"]);
    // }
    public DataBlockModel[] GetAllHistory()
    {
        return [
            new DataBlockModel {
                DeviceId = "Dev1",
                RecordTimestamp = DateTime.UtcNow.ToString("u"),
                StoredData = new MeteoDataModel {
                    TemperatureInternal = 25,
                    HumidityInternal = 36,
                    PressurePa = 100000
                }
            },
            new DataBlockModel {
                DeviceId = "Dev2",
                RecordTimestamp = DateTime.UtcNow.ToString("u"),
                StoredData = new MeteoDataModel {
                    TemperatureInternal = 28,
                    HumidityInternal = 32,
                    PressureMmHg = 757
                }
            }
        ];
    }

    [HttpGet()]
    public IEnumerable<DataBlockModel> GetHistoryPart(long? fromDate, long? toDate)
    {
        if (fromDate!=null || toDate!=null)
        {
            const int DEFAULT_PERIOD_MS = 24 * 60 * 60 * 1000;
            long fromNormalizedMs = fromDate ?? (toDate ?? DEFAULT_PERIOD_MS) - DEFAULT_PERIOD_MS;
            long toNormalizedMs = toDate ?? fromNormalizedMs + DEFAULT_PERIOD_MS;
            long maxDate = Math.Max(fromNormalizedMs, toNormalizedMs);
            long currentDate = Math.Min(fromNormalizedMs, toNormalizedMs);
            DateTime unixDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            while (currentDate < maxDate)
            {
                yield return new DataBlockModel {
                    RecordTimestamp = unixDateTime.AddMilliseconds(currentDate).ToString("u"),
                    DeviceId = "Dev1",
                    StoredData = new MeteoDataModel {
                        TemperatureInternal = Random.Shared.Next(15, 28),
                        HumidityInternal = Random.Shared.Next(25, 100),
                        PressureMmHg = Random.Shared.Next(750, 778),
                    }
                };
                currentDate += 24 * 60 * 60 * 1000;
            }
        }
    }

}