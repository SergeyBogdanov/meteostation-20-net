using System.Text.Json.Serialization;

internal class HistoryIotData
{
    [JsonPropertyName("eco2_internal")]
    public int? Eco2Internal { get; set; }

    [JsonPropertyName("airquality_internal")]
    public int? AirQualityInternal { get; set; }

    [JsonPropertyName("temp_internal")]
    public double? TemperatureInternal { get; set; }

    [JsonPropertyName("humidity_internal")]
    public double? HumidityInternal { get; set; }

    [JsonPropertyName("pressure_internal")]
    public double? PressureInternal { get; set; }

    [JsonPropertyName("temp_external")]
    public double? TemperatureExternal { get; set; }

    [JsonPropertyName("humidity_external")]
    public double? HumidityExternal { get; set; }
}