import { Component, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { HistoryListComponent } from './history/history-list.component'
import { DateControlComponent } from './controls/date-control.component'
import { FilterPanelComponent } from './controls/filter-panel.component';
import { MeteoDataItemModel } from './history/shared/meteo-data-item.model';
import { DateFormattingPipe } from './controls/date-formatting.pipe';
import { DecimalPipe } from '@angular/common';
import { MeteoDataItemFactory } from './history/shared/meteo-data-item.factory';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HistoryListComponent,
            DateControlComponent, FilterPanelComponent, 
            DateFormattingPipe, DecimalPipe,
            RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ClientApp';
  currentInfo?: MeteoDataItemModel = undefined;
  isSearchOperationActive: boolean = false;
  fromDateFilter?: Date;
  toDateFilter?: Date;
  @ViewChild('historyList') historyListElement?: HistoryListComponent;

  constructor(private meteoInfoFactory: MeteoDataItemFactory) {}

  async onSearch() {
    await this.historyListElement?.searchHistory({
      fromDate: this.fromDateFilter,
      toDate: this.toDateFilter
    });
  }

  onChangeHistorySearch(isSearching: boolean) {
    this.isSearchOperationActive = isSearching;
  }

  webSocketSubject?: WebSocketSubject<any>;

  connectWebSocket() {
    this.disconnectWebSocket();
    const wsProtocol = window.location.protocol.startsWith('https') ? 'wss' : 'ws';
    console.log(`Trying to connect to [${wsProtocol}://${window.location.host}/wsTransport]`);
    this.webSocketSubject = webSocket(`${wsProtocol}://${window.location.host}/wsTransport`);
    this.webSocketSubject.subscribe({
      next: (data) => this.consumeWebSocketInfo(data),
      error: err => console.log(`Some error is reported: [${JSON.stringify(err)}] or [${err}]]`),
      complete: () => console.log('WebSocket is closed')
    });
  }

  disconnectWebSocket() {
    console.log('Trying to disconnect');
    this.webSocketSubject?.complete();
    this.webSocketSubject = undefined;
  }

  private consumeWebSocketInfo(info: any)
  {
    this.currentInfo = this.meteoInfoFactory.restoreFromServerObject(info);
  }
}
