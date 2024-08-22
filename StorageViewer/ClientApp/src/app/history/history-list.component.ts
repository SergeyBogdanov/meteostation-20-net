import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { HistoryItemComponent } from './history-item.component';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HistoryFilterOptionsModel } from './shared/history-filter-options.model';

@Component({
  selector: 'history-list',
  standalone: true,
  imports: [HistoryItemComponent],
  templateUrl: 'history-list.component.html',
  styleUrl: 'history-list.component.css'
})
export class HistoryListComponent {
    historyRows: any[] = [];
    @ViewChildren('meteoRowElement') historyRowElements?: QueryList<HistoryItemComponent>;
  
    constructor(private client : HttpClient) {}

    async searchHistory(options: HistoryFilterOptionsModel): Promise<void> {
        //console.log(`Make the search operation here: ${this.fromDateFilter ? JSON.stringify(this.fromDateFilter) : 'n/a'} - ${this.toDateFilter ? JSON.stringify(this.toDateFilter) : 'n/a'}`);
        if (options.fromDate || options.toDate) {
            const res = await lastValueFrom(this.client.get('api/History/all'));
            if (Array.isArray(res)) {
                this.historyRows = res;
            }
        }
    }

    onChosen(dataItem: any) {
        if (this.historyRowElements) {
          this.historyRowElements.forEach(element => {
            element.highlighted = element.item === dataItem;
          });
        }
    }
};