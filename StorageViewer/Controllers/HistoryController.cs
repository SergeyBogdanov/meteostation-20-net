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
}