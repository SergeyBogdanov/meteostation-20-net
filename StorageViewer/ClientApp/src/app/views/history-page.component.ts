import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DateControlComponent } from '../controls/date-control.component';
import { FilterPanelComponent } from '../controls/filter-panel.component';
import { HistorySearchComponent } from '../history/history-search.component';

@Component({
  selector: 'history-page',
  standalone: true,
  imports: [RouterLink, HistorySearchComponent,
    DateControlComponent, FilterPanelComponent],
  templateUrl: 'history-page.component.html',
  styleUrl: 'history-page.component.css'
})
export class HistoryPageComponent {
    isSearchOperationActive: boolean = false;
    fromDateFilter?: Date;
    toDateFilter?: Date;
    @ViewChild('historySearch') historySearchElement?: HistorySearchComponent;

    async onSearch() {
        await this.historySearchElement?.searchHistory({
          fromDate: this.fromDateFilter,
          toDate: this.toDateFilter
        });
      }
    
    onChangeHistorySearch(isSearching: boolean) {
        this.isSearchOperationActive = isSearching;
    }
};