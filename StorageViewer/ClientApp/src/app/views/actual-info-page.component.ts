import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { MeteoDataItemFactory } from '../history/shared/meteo-data-item.factory';
import { DuplexChannelService } from '../common/duplex-channel.service';
import { MeteoDataItemModel } from '../history/shared/meteo-data-item.model';
import { DateFormattingPipe } from '../controls/date-formatting.pipe';
import { numberChangeAnimation } from '../animations';
import { AirQualityDirective } from '../controls/air-quality.directive';
import { AirQualityComponent } from '../controls/air-quality.component';

@Component({
  selector: 'actual-info-page',
  standalone: true,
  imports: [RouterLink, DateFormattingPipe, DecimalPipe, AirQualityDirective, AirQualityComponent],
  templateUrl: 'actual-info-page.component.html',
  styleUrl: 'actual-info-page.component.css',
  animations: [numberChangeAnimation]
})
export class ActualInfoPageComponent {
    currentInfo?: MeteoDataItemModel = undefined;
    private actualSubscription?: Subscription;

    constructor(private meteoInfoFactory: MeteoDataItemFactory, private serverChannel: DuplexChannelService) {}

    ngOnInit() {
        this.actualSubscription = this.serverChannel.dataReceived.subscribe((data) => this.consumeWebSocketInfo(data));
        this.serverChannel.ensureConnect();
    }

    ngOnDestroy() {
        this.actualSubscription?.unsubscribe();
    }

    private consumeWebSocketInfo(info: any) {
        this.currentInfo = this.meteoInfoFactory.restoreFromServerObject(info);
    }
};