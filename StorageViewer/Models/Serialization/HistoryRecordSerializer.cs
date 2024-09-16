using System.Text.Json;

namespace StorageViewer.Models.Serialization;

internal static class HistoryRecordSerializer 
{
    public static DataBlockModel DeserializeWholeRecord(string? json)
    {
        var deserialized = JsonSerializer.Deserialize<HistoryRecord>(json ?? "");
        return PackDataBlock(deserialized?.MessageDate, deserialized?.DeviceId, deserialized?.IotData);
    }

    public static DataBlockModel DeserializeWMeteoData(DateTimeOffset? timestamp, string? deviceId, string? meteoDataJson)
    {
        var deserialized = JsonSerializer.Deserialize<HistoryIotData>(meteoDataJson ?? "");
        return PackDataBlock(timestamp, deviceId, deserialized);
    }

    private static DataBlockModel PackDataBlock(DateTimeOffset? timestamp, string? deviceId, HistoryIotData? meteoData) =>
        new DataBlockModel {
            RecordTimestamp = timestamp?.ToString("u") ?? "n/a",
            DeviceId = deviceId ?? "n/a",
            StoredData = new MeteoDataModel {
                TemperatureInternal = meteoData?.TemperatureInternal ?? 0.0,
                HumidityInternal = meteoData?.HumidityInternal ?? 0.0,
                PressurePa = meteoData?.PressureInternal ?? 0.0,
                TemperatureExternal = meteoData?.TemperatureExternal ?? 0.0,
                HumidityExternal = meteoData?.HumidityExternal ?? 0.0,
                AirQualityInternal = meteoData?.AirQualityInternal ?? -1,
                Eco2Internal = meteoData?.Eco2Internal ?? 0,
            }
        };
}
