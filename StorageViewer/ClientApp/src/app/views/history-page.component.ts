import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HistoryListComponent } from '../history/history-list.component';
import { DateControlComponent } from '../controls/date-control.component';
import { FilterPanelComponent } from '../controls/filter-panel.component';

@Component({
  selector: 'history-page',
  standalone: true,
  imports: [RouterLink, HistoryListComponent,
    DateControlComponent, FilterPanelComponent],
  templateUrl: 'history-page.component.html',
  styleUrl: 'history-page.component.css'
})
export class HistoryPageComponent {
    isSearchOperationActive: boolean = false;
    fromDateFilter?: Date;
    toDateFilter?: Date;
    @ViewChild('historyList') historyListElement?: HistoryListComponent;
    actualCount: number = 25;

    async onSearch() {
        await this.historyListElement?.searchHistory({
          fromDate: this.fromDateFilter,
          toDate: this.toDateFilter
        });
      }
    
    onChangeHistorySearch(isSearching: boolean) {
        this.isSearchOperationActive = isSearching;
    }
};