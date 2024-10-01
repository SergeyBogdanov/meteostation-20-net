import { Component, Input } from "@angular/core";
import { BaseChartDirective } from "ng2-charts";
import "chartjs-adapter-moment";

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
                label: 'Pressure (mmHg)',
                yAxisID: 'pressureHgAxis',
                data: this.composeDataArray(val, item => item.storedData?.pressureMmHg)
            },
            {
                label: 'Indoor Humidity (%)',
                yAxisID: 'humidityAxis',
                data: this.composeDataArray(val, item => item.storedData?.humidityInternal)
            },
            {
                label: 'Outdoor Humidity (%)',
                yAxisID: 'humidityAxis',
                data: this.composeDataArray(val, item => item.storedData?.humidityExternal)
            },
            {
                label: 'Indoor Temperature (C)',
                yAxisID: 'tempAxis',
                data: this.composeDataArray(val, item => item.storedData?.temperatureInternal)
            },
            {
                label: 'Outdoor Temperature (C)',
                yAxisID: 'tempAxis',
                data: this.composeDataArray(val, item => item.storedData?.temperatureExternal)
            },
            {
                label: 'eCO2 (ppm)',
                yAxisID: 'eCo2Axis',
                data: this.composeDataArray(val, item => (item.storedData?.eco2Internal > 0 ? item.storedData?.eco2Internal : null))
            }]
        }
    }

    private composeDataArray(sourceData: MeteoDataItemModel[], extractProc: (item: MeteoDataItemModel) => any) {
        return (sourceData ?? []).map(item => ({x: item.recordTimestamp, y: extractProc(item)}));
    }

    chartData: any = {
        datasets: [{
            data: [{x: '1', y: 3}, {x: '2', y: 5}, {x: '3', y: 7}]
        }]
    };

    chartOptions: any = {
        scales: {
            yAxes: {
                'tempAxis' : {
                    type: 'linear',
                    position: 'left'
                },
                'humidityAxis' : {
                    type: 'linear',
                    position: 'right'
                },
                'eCo2Axis' : {
                    type: 'linear',
                    position: 'right'
                },
                'pressureHgAxis' : {
                    type: 'linear',
                    position: 'right'
                }
            },
            xAxis: {
                type: "time"
            }
        }
    };
}