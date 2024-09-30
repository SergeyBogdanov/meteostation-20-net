import { Component, Input } from "@angular/core";
import { BaseChartDirective } from "ng2-charts";

import { MeteoDataItemModel } from "./shared/meteo-data-item.model";

@Component({
    selector: 'history-chart',
    standalone: true,
    imports: [BaseChartDirective],
    templateUrl: 'history-chart.component.html',
    styleUrl: 'history-chart.component.css'
})
export class HistoryChartComponent {
    private originalHistoryRows: MeteoDataItemModel[] = [];
    @Input() get historyRows(): MeteoDataItemModel[] {
        return this.originalHistoryRows;
    }
    set historyRows(val: MeteoDataItemModel[]) {
        this.originalHistoryRows = val;
        this.chartData = {
            datasets: [{
                data: (val ?? []).map(item => ({x: item.recordTimestamp, y: item.storedData?.pressureMmHg}))
            }]
        }
    }

    chartData: any = {
        datasets: [{
            data: [{x: '1', y: 3}, {x: '2', y: 5}, {x: '3', y: 7}]
        }]
    };

    chartOptions: any = {
        // scales: {
        //     yAxis: {
        //         type: "time"
        //     }
        // }
    };
}