using Azure.Data.Tables;
using StorageViewer.Models;
using StorageViewer.Models.Serialization;

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
                yield return HistoryRecordSerializer.DeserializeWholeRecord(entity.GetString("payload"));
            }
        }
    }

    private TableClient GetTableClient()
    {
        _currentClient ??= new TableClient(_configuration["Services:History:StorageConnectionString"], 
                                            _configuration["Services:History:StorageTableName"]);
        return _currentClient;
    }
}
