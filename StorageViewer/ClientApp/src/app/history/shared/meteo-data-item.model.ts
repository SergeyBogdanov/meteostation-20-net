export class StoredMeteoData {
    temperatureInternal: number;
    humidityInternal: number;
    pressureMmHg: number;

    constructor(temperature: number, humidity: number, pressure: number) {
        this.temperatureInternal = temperature;
        this.humidityInternal = humidity;
        this.pressureMmHg = pressure;
    }
};

export class MeteoDataItemModel {
    deviceId: string;
    recordTimestamp: string;
    storedData: StoredMeteoData;

    constructor(deviceId: string, timestamp: string, temperature: number, humidity: number, pressure: number) {
        this.deviceId = deviceId;
        this.recordTimestamp = timestamp;
        this.storedData = new StoredMeteoData(temperature, humidity, pressure);
    }
};