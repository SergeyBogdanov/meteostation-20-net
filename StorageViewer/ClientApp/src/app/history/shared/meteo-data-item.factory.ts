import { Injectable } from "@angular/core";
import { MeteoDataItemModel } from "./meteo-data-item.model";

@Injectable({
    providedIn: 'root'
})
export class MeteoDataItemFactory {
    restoreFromServerObject(serverObject: any): MeteoDataItemModel
    {
        return (serverObject.deviceId && serverObject.storedData) ?
            new MeteoDataItemModel(serverObject.deviceId, serverObject.recordTimestamp, serverObject.previousEntityMissed,
                serverObject.storedData.temperatureInternal, serverObject.storedData.humidityInternal,
                serverObject.storedData.pressureMmHg, serverObject.storedData.pressurePa,
                serverObject.storedData.temperatureExternal, serverObject.storedData.humidityExternal,
                serverObject.storedData.airQualityInternal, serverObject.storedData.eco2Internal) :
            new MeteoDataItemModel('', '', false, 0, 0, 0, 0, 0, 0, 0, 0);
    }
};