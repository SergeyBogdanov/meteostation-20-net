using System.Text.Json.Serialization;

internal record class HistoryIotData(
    [property:JsonPropertyName("eco2_internal")] int? Eco2Internal,
    [property:JsonPropertyName("airquality_internal")] int? AirQualityInternal,
    [property:JsonPropertyName("temp_internal")] double? TemperatureInternal,
    [property:JsonPropertyName("humidity_internal")] double? HumidityInternal,
    [property:JsonPropertyName("pressure_internal")] double? PressureInternal,
    [property:JsonPropertyName("temp_external")] double? TemperatureExternal,
    [property:JsonPropertyName("humidity_external")] double? HumidityExternal
);