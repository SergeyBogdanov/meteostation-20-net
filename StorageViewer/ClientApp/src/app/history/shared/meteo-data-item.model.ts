export class StoredMeteoData {
    constructor(public temperatureInternal: number, 
        public humidityInternal: number,
        public pressureMmHg: number,
        public pressurePa: number,
        public temperatureExternal: number, 
        public humidityExternal: number,
        public airQualityInternal: number, 
        public eco2Internal: number
        ) { }
};

export class MeteoDataItemModel {
    deviceId: string;
    recordTimestamp: string;
    storedData: StoredMeteoData;

    constructor(deviceId: string, timestamp: string, 
        temperature: number, humidity: number, pressureMmHg: number, pressurePa: number,
        temperatureExternal: number, humidityExternal: number, airQualityInternal: number, eco2Internal: number) {
        this.deviceId = deviceId;
        this.recordTimestamp = timestamp;
        this.storedData = new StoredMeteoData(temperature, humidity, pressureMmHg, pressurePa,
                                                temperatureExternal, humidityExternal, airQualityInternal, eco2Internal);
    }
};