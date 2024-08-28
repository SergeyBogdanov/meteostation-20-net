import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from 'rxjs';
import { Injectable } from "@angular/core";
import { MeteoDataItemModel } from "./meteo-data-item.model";

@Injectable({
    providedIn: 'root'
})
export class HistoryService {
    constructor(private client: HttpClient)
    {}

    async getHistory(from: Date, to: Date): Promise<MeteoDataItemModel[]> {
        let result: MeteoDataItemModel[] = [];
        const res = await lastValueFrom(this.client.get('api/History', {
            params: {
                fromDate: from.getTime(),
                toDate: to.getTime()
            }
        }));
        if (Array.isArray(res)) {
            result = res.map(item => new MeteoDataItemModel(item.deviceId, item.recordTimestamp,
                item.storedData.temperatureInternal, item.storedData.humidityInternal, item.storedData.pressureMmHg));
        }
        return result;
    }
}