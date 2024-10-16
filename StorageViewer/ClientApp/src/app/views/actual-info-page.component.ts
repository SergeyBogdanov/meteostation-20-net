import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { numberChangeAnimation } from '../animations';
import moment from 'moment';

import { MeteoDataItemFactory } from '../history/shared/meteo-data-item.factory';
import { DuplexChannelService } from '../common/duplex-channel.service';
import { MeteoDataItemModel } from '../history/shared/meteo-data-item.model';
import { DateFormattingPipe } from '../controls/date-formatting.pipe';
import { AirQualityDirective } from '../controls/air-quality.directive';
import { AirQualityComponent } from '../controls/air-quality.component';
import { AxisOptions, DateAxisChartComponent, DateAxisChartOptions } from '../controls/date-axis-chart.component';
import { HistoryService } from '../history/shared/history.service';

class AxisOptionsImpl implements AxisOptions {
    constructor(public groupId: string) {}
}

@Component({
  selector: 'actual-info-page',
  standalone: true,
  imports: [RouterLink, DateFormattingPipe, DecimalPipe, AirQualityDirective, AirQualityComponent, DateAxisChartComponent],
  templateUrl: 'actual-info-page.component.html',
  styleUrl: 'actual-info-page.component.css',
  animations: [numberChangeAnimation]
})
export class ActualInfoPageComponent {
    currentInfo?: MeteoDataItemModel = undefined;
    indoorDataBlock: number[][] = [];
    outdoorDataBlock: number[][] = [];
    multiChartOptions: DateAxisChartOptions = {};
    latestPressureData: number[] = [];
    dataTimestampLabels: string[] = [];

    private actualSubscription?: Subscription;

    constructor(private meteoInfoFactory: MeteoDataItemFactory, private serverChannel: DuplexChannelService, private historyService: HistoryService) {}

    async ngOnInit() {
        this.actualSubscription = this.serverChannel.dataReceived.subscribe((data) => this.consumeWebSocketInfo(data));
        this.serverChannel.ensureConnect();
        const historycalData = await this.requestLatestData();
        this.aggregateHistoryData(historycalData);
    }

    ngOnDestroy() {
        this.actualSubscription?.unsubscribe();
    }

    private consumeWebSocketInfo(info: any) {
        this.currentInfo = this.meteoInfoFactory.restoreFromServerObject(info);
    }

    private async requestLatestData(): Promise<MeteoDataItemModel[]> {
        return await this.historyService.getHistory(moment().subtract(12, 'hours').toDate(), moment().toDate());
    }

    private aggregateHistoryData(dataBlock: MeteoDataItemModel[]) {
        this.indoorDataBlock = [dataBlock.map(item => item.storedData?.humidityInternal ?? 0),
                                    dataBlock.map(item => item.storedData?.temperatureInternal ?? 0)];
        this.outdoorDataBlock = [dataBlock.map(item => item.storedData?.humidityExternal ?? 0),
                                    dataBlock.map(item => item.storedData?.temperatureExternal ?? 0)];
        this.multiChartOptions = {
            axisOptions: [new AxisOptionsImpl('humidity'),
                            new AxisOptionsImpl('temprature')]
        };
        this.latestPressureData = dataBlock.map(item => item.storedData?.pressureMmHg ?? 0);
        this.dataTimestampLabels = dataBlock.map(item => item.recordTimestamp);
    }
};