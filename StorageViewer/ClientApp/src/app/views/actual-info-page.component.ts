import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { MeteoDataItemFactory } from '../history/shared/meteo-data-item.factory';
import { DuplexChannelService } from '../common/duplex-channel.service';
import { MeteoDataItemModel } from '../history/shared/meteo-data-item.model';
import { DateFormattingPipe } from '../controls/date-formatting.pipe';

@Component({
  selector: 'actual-info-page',
  standalone: true,
  imports: [DateFormattingPipe, DecimalPipe],
  templateUrl: 'actual-info-page.component.html',
  styleUrl: 'actual-info-page.component.css'
})
export class ActualInfoPageComponent {
    @Input() cnt: number = 0;
    currentInfo?: MeteoDataItemModel = undefined;

    constructor(private meteoInfoFactory: MeteoDataItemFactory, private serverChannel: DuplexChannelService) {}

    ngOnInit() {
        this.serverChannel.dataReceived.subscribe((data) => this.consumeWebSocketInfo(data));
        this.serverChannel.ensureConnect();
    }

    private consumeWebSocketInfo(info: any) {
        this.currentInfo = this.meteoInfoFactory.restoreFromServerObject(info);
    }
};