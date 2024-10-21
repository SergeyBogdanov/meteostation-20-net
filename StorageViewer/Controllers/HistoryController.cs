using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using StorageViewer.Models;
using StorageViewer.Services;

namespace StorageViewer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class HistoryController : ControllerBase
{
    private readonly ILogger<HistoryController> _logger;
    private readonly IHistoryService _historyService;

    public HistoryController(ILogger<HistoryController> logger, IHistoryService historyService)
    {
        _logger = logger;
        _historyService = historyService;
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
                NativeTimeStamp = DateTime.UtcNow,
                DeviceId = "Dev1",
                RecordTimestamp = DateTime.UtcNow.ToString("u"),
                StoredData = new MeteoDataModel {
                    TemperatureInternal = 25,
                    HumidityInternal = 36,
                    PressurePa = 100000
                }
            },
            new DataBlockModel {
                NativeTimeStamp = DateTime.UtcNow,
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
    public async IAsyncEnumerable<DataBlockModel> GetHistoryPart(long? fromDate, long? toDate)
    {
        if (fromDate!=null || toDate!=null)
        {
            const int DEFAULT_PERIOD_MS = 24 * 60 * 60 * 1000;
            long fromNormalizedMs = fromDate ?? (toDate ?? DEFAULT_PERIOD_MS) - DEFAULT_PERIOD_MS;
            long toNormalizedMs = toDate ?? fromNormalizedMs + DEFAULT_PERIOD_MS;
            long maxDate = Math.Max(fromNormalizedMs, toNormalizedMs);
            long minDate = Math.Min(fromNormalizedMs, toNormalizedMs);
            DateTimeOffset? lastOffset = null;
            await foreach(var entity in  _historyService.GetHistoryInformation(
                DateTimeOffset.FromUnixTimeMilliseconds(minDate), 
                DateTimeOffset.FromUnixTimeMilliseconds(maxDate).AddDays(1)))
            {
                SetCountinousMarker(entity, lastOffset);
                lastOffset = entity.NativeTimeStamp ?? lastOffset;
                yield return entity;
            }
        }
    }

    private void SetCountinousMarker(DataBlockModel entity, DateTimeOffset? lastOffset)
    {
        if (((entity.NativeTimeStamp - lastOffset)?.TotalMinutes ?? 0) >= 10)
        {
            entity.PreviousEntityMissed = true;
        }
    }
}