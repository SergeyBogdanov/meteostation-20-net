import { Component } from "@angular/core";
import { BaseChartDirective } from "ng2-charts";

@Component({
    selector: 'history-chart',
    standalone: true,
    imports: [BaseChartDirective],
    templateUrl: 'history-chart.component.html',
    styleUrl: 'history-chart.component.css'
})
export class HistoryChartComponent {
    chartData: any = {
        datasets: [{
            data: [{x: '1', y: 3}, {x: '2', y: 5}, {x: '3', y: 7}]
        }]
    };
}