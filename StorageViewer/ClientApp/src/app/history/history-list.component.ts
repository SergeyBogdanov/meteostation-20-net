import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { HistoryItemComponent } from './history-item.component';
import { HistoryFilterOptionsModel } from './shared/history-filter-options.model';
import { HistoryService } from './shared/history.service';
import { MeteoDataItemModel } from './shared/meteo-data-item.model';

@Component({
  selector: 'history-list',
  standalone: true,
  imports: [HistoryItemComponent],
  templateUrl: 'history-list.component.html',
  styleUrl: 'history-list.component.css'
})
export class HistoryListComponent {
    historyRows: MeteoDataItemModel[] = [];
    actionInProgress: boolean = false;
    @Output() changeSearchStatus = new EventEmitter<boolean>();
    @ViewChildren('meteoRowElement') historyRowElements?: QueryList<HistoryItemComponent>;
  
    constructor(private historyService: HistoryService) {}

    async searchHistory(options: HistoryFilterOptionsModel): Promise<void> {
        if (options.fromDate || options.toDate) {

            this.notifySearchStatus(true);
            this.historyRows = await this.historyService.getHistory(options.fromDate ?? new Date(),
                                                new Date((options.toDate ?? new Date()).getTime() + 24 * 60 * 60 * 1000));
            this.notifySearchStatus(false);
        }
    }

    onChosen(dataItem: any) {
        if (this.historyRowElements) {
          this.historyRowElements.forEach(element => {
            element.highlighted = element.item === dataItem;
          });
        }
    }

    private notifySearchStatus(isSearching: boolean): void {
        this.actionInProgress = isSearching;
        this.changeSearchStatus.emit(isSearching);
    }
};