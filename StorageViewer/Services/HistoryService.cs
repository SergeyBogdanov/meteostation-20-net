using System.Text.Json;
using Azure.Data.Tables;
using StorageViewer.Models;

namespace StorageViewer.Services;

public class HistoryService: IHistoryService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<HistoryService> _logger;

    private TableClient? _currentClient = null;

    public HistoryService(IConfiguration configuration, ILogger<HistoryService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async IAsyncEnumerable<DataBlockModel> GetHistoryInformation(DateTimeOffset from, DateTimeOffset to)
    {
        var tableClient = GetTableClient();
        await foreach(var entity in tableClient.QueryAsync<TableEntity>(
            $"PartitionKey eq '{_configuration["Services:History:PartitionKey"]}' and Timestamp ge datetime'{from:o}' and Timestamp le datetime'{to:o}'"))
        {
            if (!String.IsNullOrEmpty(entity.GetString("payload")))
            {
                var deserialized = JsonSerializer.Deserialize<HistoryRecord>(entity.GetString("payload") ?? "");
                yield return new DataBlockModel {
                    RecordTimestamp = deserialized?.MessageDate?.ToString("u") ?? "n/a",
                    DeviceId = deserialized?.DeviceId ?? "n/a",
                    StoredData = new MeteoDataModel {
                        TemperatureInternal = deserialized?.IotData?.TemperatureInternal ?? 0.0,
                        HumidityInternal = deserialized?.IotData?.HumidityInternal ?? 0.0,
                        PressurePa = deserialized?.IotData?.PressureInternal ?? 0.0,
                    }
                };
            }
        }
    }

    private TableClient GetTableClient()
    {
        if (_currentClient == null)
        {
            _currentClient = new TableClient(_configuration["Services:History:StorageConnectionString"], 
                                                _configuration["Services:History:StorageTableName"]);
        }
        return _currentClient;
    }
}
