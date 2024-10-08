import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { FilterPanelComponent } from "../controls/filter-panel.component";
import { DateAxisChartComponent, DateAxisChartType } from "../controls/date-axis-chart.component";
import moment from "moment";
import { HistoryService } from "../history/shared/history.service";
import { FormsModule } from "@angular/forms";

class RawPressureData {
    constructor(public timestamp: moment.Moment, public pressureMmHg: number, public presurrePa: number) {}
}

@Component({
    selector: 'pressure-details-page',
    standalone: true,
    imports: [RouterLink, FilterPanelComponent, DateAxisChartComponent, FormsModule],
    templateUrl: 'pressure-details-page.component.html',
    styleUrl: 'pressure-details-page.component.css'
})
export class PressureDetailsPageComponent {
    working : boolean = false;
    periodDuration: number = 1;
    aggregateHours: number = 0;
    get chartType(): DateAxisChartType {
        return this.aggregateHours > 0 ? 'bar' : 'line';
    }
    pressureData: number[] = [];
    pressureLabels: string[] = [];
    private pressureHistory: RawPressureData[] = [];

    constructor(private historyService: HistoryService) {}

    async onSearch() {
        try {
            this.working = true;
            const history = await this.historyService.getHistory(moment().subtract(this.periodDuration, 'days').toDate(), moment().toDate());
            this.pressureHistory = history.map(item => new RawPressureData(
                                                            moment(item.recordTimestamp), 
                                                            item.storedData?.pressureMmHg ?? 0, 
                                                            item.storedData?.pressurePa ?? 0));
            this.aggregateData();
        } finally {
            this.working = false;
        }
    }

    private aggregateData(): void {
        this.pressureData = [];
        this.pressureLabels = [];
        if (this.aggregateHours === 0) {
            this.pressureData = this.pressureHistory.map(item => item.pressureMmHg);
            this.pressureLabels = this.pressureHistory.map(item => item.timestamp.toISOString());
        }
    }
}