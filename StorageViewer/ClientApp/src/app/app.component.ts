import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from '@angular/forms';

import { HistoryListComponent } from './history/history-list.component'
import { DateControlComponent } from './controls/date-control.component'
import { FilterPanelComponent } from './controls/filter-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HistoryListComponent, DateControlComponent, FilterPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ClientApp';
  isSearchOperationActive: boolean = false;
  fromDateFilter?: Date;
  toDateFilter?: Date;
  @ViewChild('historyList') historyListElement?: HistoryListComponent;

  async onSearch() {
    await this.historyListElement?.searchHistory({
      fromDate: this.fromDateFilter,
      toDate: this.toDateFilter
    });
  }

  onChangeHistorySearch(isSearching: boolean) {
    this.isSearchOperationActive = isSearching;
  }
}
