using Azure.Messaging.EventHubs.Consumer;
using StorageViewer.Models;
using StorageViewer.Models.Serialization;

namespace StorageViewer.Services;

internal class ExternalListenerService : BackgroundService
{
    private readonly ILogger<ExternalListenerService> _logger;
    private readonly IConfiguration _configuration;
    private readonly IInternalExchangeService _exchangeService;

    public ExternalListenerService(IConfiguration configuration, IInternalExchangeService exchangeService, ILogger<ExternalListenerService> logger) 
    {
        _logger = logger;
        _configuration = configuration;
        _exchangeService = exchangeService;
    }

    async protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var client = new EventHubConsumerClient(_configuration["Services:IotHub:consumerGroup"], _configuration["Services:IotHub:connectionString"]);
        while (!stoppingToken.IsCancellationRequested)
        {
            try 
            {
                await foreach(PartitionEvent evt in client.ReadEventsAsync(stoppingToken))
                {
                    if (evt.Data != null)
                    {
                        DataBlockModel data = HistoryRecordSerializer.DeserializeWMeteoData(evt.Data.EnqueuedTime, 
                                    evt.Data.SystemProperties["iothub-connection-device-id"]?.ToString(),
                                    evt.Data.EventBody.ToString());
                        _logger.LogInformation($"Received event: body: [{evt.Data.EventBody}] temp: {data.StoredData.TemperatureInternal}, device id: [{data.DeviceId}]");
                        _exchangeService.Publish(data);
                    }
                }
            }
            catch(TaskCanceledException)
            {}
        }
    }
}