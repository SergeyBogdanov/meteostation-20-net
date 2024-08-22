namespace StorageViewer.Models;

public class MeteoDataModel
{
    private const double conversionPaToMmHg = 1 / 133.32239;
    private double pressurePa = 0.0;
    private double pressureMmHg = 0.0;

    public double TemperatureInternal { get; set; }

    public double HumidityInternal { get; set; }

    public double PressureMmHg
    {
        get => pressureMmHg;
        set//(double value)
        {
            pressureMmHg = value;
            pressurePa = value / conversionPaToMmHg;
        }
    }

    public double PressurePa
    {
        get => pressurePa;
        set//(double value)
        {
            pressurePa = value;
            pressureMmHg = value * conversionPaToMmHg;
        }
    }
}