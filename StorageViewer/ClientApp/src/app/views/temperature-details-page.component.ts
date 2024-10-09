import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { DateAxisChartComponent } from "../controls/date-axis-chart.component";
import { FilterPanelComponent } from "../controls/filter-panel.component";
import { HistoryService } from "../history/shared/history.service";
import moment from "moment";

class RawTemperatureData {
    constructor(public timestamp: moment.Moment, public temperature: number) {}
}

@Component({
    selector: 'temperature-details-page',
    standalone: true,
    imports: [RouterLink, FilterPanelComponent, DateAxisChartComponent, FormsModule],
    templateUrl: 'temperature-details-page.component.html',
    styleUrl: 'temperature-details-page.component.css'
})
export class TemperatureDetailsPageComponent {
    working : boolean = false;
    periodDuration: number = 1;
    chartData: number[] /*| number[][]*/ = [];
    commonLabels: string[] = [];
    _aggregateHours: number = 0;
    get aggregateHours() : number {
        return this._aggregateHours;
    }
    set aggregateHours(newValue: number) {
        this._aggregateHours = newValue;
        this.aggregateData();
    }
    private rawData: RawTemperatureData[] = [];

    constructor(private historyService: HistoryService) {}

    async onDataRequest() {
        try {
            this.working = true;
            const history = await this.historyService.getHistoryForDays(this.periodDuration);
            this.rawData = history.map(item => new RawTemperatureData(
                                                            moment(item.recordTimestamp), 
                                                            item.storedData?.temperatureExternal ?? 0));
            this.aggregateData();
        } finally {
            this.working = false;
        }
    }

    private aggregateData(): void {
        if (this.aggregateHours === 0) {
            this.chartData = this.rawData.map(item => item.temperature);
            this.commonLabels = this.rawData.map(item => item.timestamp.toISOString());
        } else {
            this.chartData = [];
            this.commonLabels = [];
        }
    }
}