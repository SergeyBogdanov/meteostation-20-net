import { Injectable } from "@angular/core";
import { MeteoDataItemModel } from "./meteo-data-item.model";

@Injectable({
    providedIn: 'root'
})
export class MeteoDataItemFactory {
    restoreFromServerObject(serverObject: any): MeteoDataItemModel
    {
        return serverObject.deviceId ?
            new MeteoDataItemModel(serverObject.deviceId, serverObject.recordTimestamp,
                serverObject.storedData.temperatureInternal, serverObject.storedData.humidityInternal, serverObject.storedData.pressureMmHg) :
            new MeteoDataItemModel('', '', 0, 0, 0)
    }
};