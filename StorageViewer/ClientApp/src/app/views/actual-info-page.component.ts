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
import { DateAxisChartComponent } from '../controls/date-axis-chart.component';
import { HistoryService } from '../history/shared/history.service';

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
    latestPressureData: number[] = [];
    pressureDataLabels: string[] = [];

    private actualSubscription?: Subscription;

    constructor(private meteoInfoFactory: MeteoDataItemFactory, private serverChannel: DuplexChannelService, private historyService: HistoryService) {}

    async ngOnInit() {
        this.actualSubscription = this.serverChannel.dataReceived.subscribe((data) => this.consumeWebSocketInfo(data));
        this.serverChannel.ensureConnect();
        const historycalData = await this.requestLatestData();
        this.aggregatePressureData(historycalData);
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

    private aggregatePressureData(dataBlock: MeteoDataItemModel[]) {
        this.latestPressureData = dataBlock.map(item => item.storedData?.pressureMmHg ?? 0);
        this.pressureDataLabels = dataBlock.map(item => item.recordTimestamp);
    }
};