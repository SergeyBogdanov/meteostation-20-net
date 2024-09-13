import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {FormsModule} from '@angular/forms';

import { MeteoDataItemModel } from './history/shared/meteo-data-item.model';
import { DateFormattingPipe } from './controls/date-formatting.pipe';
import { DecimalPipe } from '@angular/common';
import { MeteoDataItemFactory } from './history/shared/meteo-data-item.factory';
import { DuplexChannelService } from './common/duplex-channel.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, 
            DateFormattingPipe, DecimalPipe,
            RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ClientApp';
  currentInfo?: MeteoDataItemModel = undefined;
  count: number = 33;

  constructor(private meteoInfoFactory: MeteoDataItemFactory, private serverChannel: DuplexChannelService) {}

  ngOnInit() {
    this.serverChannel.dataReceived.subscribe((data) => this.consumeWebSocketInfo(data));
    this.serverChannel.ensureConnect();
  }

  private consumeWebSocketInfo(info: any)
  {
    this.currentInfo = this.meteoInfoFactory.restoreFromServerObject(info);
  }
}
