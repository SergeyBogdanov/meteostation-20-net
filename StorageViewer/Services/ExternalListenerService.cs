using Azure.Messaging.EventHubs.Consumer;
using StorageViewer.Models;
using StorageViewer.Models.Serialization;

namespace StorageViewer.Services;

internal class ExternalListenerService : BackgroundService
{
    private readonly ILogger<ExternalListenerService> _logger;
    private readonly IConfiguration _configuration;

    public ExternalListenerService(IConfiguration configuration, ILogger<ExternalListenerService> logger) 
    {
        _logger = logger;
        _configuration = configuration;
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
                        _logger.LogInformation($"Received event: body: [{evt.Data.EventBody}] prop: {evt.Data.Properties.Keys.FirstOrDefault()}, sys props: {String.Join(", ", evt.Data.SystemProperties.Keys)}, device id: [{data.DeviceId}]");
                    }
                }
            }
            catch(TaskCanceledException)
            {}
        }
    }
}