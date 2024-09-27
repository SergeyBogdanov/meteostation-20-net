import { Component, EventEmitter, Output } from "@angular/core";
import { HistoryService } from "./shared/history.service";
import { HistoryFilterOptionsModel } from "./shared/history-filter-options.model";
import { MeteoDataItemModel } from "./shared/meteo-data-item.model";
import { HistoryListComponent } from "./history-list.component";
import { HistoryChartComponent } from "./history-chart.component";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'history-search',
    standalone: true,
    imports: [HistoryListComponent, HistoryChartComponent, FormsModule],
    templateUrl: 'history-search.component.html',
    styleUrl: 'history-search.component.css'
})
export class HistorySearchComponent {
    historyRows: MeteoDataItemModel[] = [];
    actionInProgress: boolean = false;
    isTableShown: boolean = true;
    @Output() changeSearchStatus = new EventEmitter<boolean>();

    constructor(private historyService: HistoryService) {}

    async searchHistory(options: HistoryFilterOptionsModel): Promise<void> {
        if (options.fromDate || options.toDate) {

            this.notifySearchStatus(true);
            this.historyRows = await this.historyService.getHistory(options.fromDate ?? new Date(),
                                                new Date((options.toDate ?? new Date()).getTime() + 24 * 60 * 60 * 1000));
            this.notifySearchStatus(false);
        }
    }

    setTableView(viewTable:boolean) {
        this.isTableShown = viewTable;
    }

    private notifySearchStatus(isSearching: boolean): void {
        this.actionInProgress = isSearching;
        this.changeSearchStatus.emit(isSearching);
    }
}  