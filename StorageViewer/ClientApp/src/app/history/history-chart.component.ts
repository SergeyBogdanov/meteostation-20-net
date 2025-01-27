import { Component, Input, ViewChild } from "@angular/core";
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

    @ViewChild('mainChart', { read: BaseChartDirective }) mainChart?: BaseChartDirective;
    @Input() get historyRows(): MeteoDataItemModel[] {
        return this.originalHistoryRows;
    }
    set historyRows(val: MeteoDataItemModel[]) {
        this.originalHistoryRows = val;
        this.chartData = {
            datasets: [{
                label: $localize`:History chart column|History chart column title:Pressure (mmHg)`,
                yAxisID: 'pressureHgAxis',
                data: this.composeDataArray(val, item => item.storedData?.pressureMmHg)
            },
            {
                label: $localize`:History chart column|History chart column title:Indoor Humidity (%)`,
                yAxisID: 'humidityAxis',
                data: this.composeDataArray(val, item => item.storedData?.humidityInternal)
            },
            {
                label: $localize`:History chart column|History chart column title:Outdoor Humidity (%)`,
                yAxisID: 'humidityAxis',
                data: this.composeDataArray(val, item => item.storedData?.humidityExternal)
            },
            {
                label: $localize`:History chart column|History chart column title:Indoor Temperature (C)`,
                yAxisID: 'tempAxis',
                data: this.composeDataArray(val, item => item.storedData?.temperatureInternal)
            },
            {
                label: $localize`:History chart column|History chart column title:Outdoor Temperature (C)`,
                yAxisID: 'tempAxis',
                data: this.composeDataArray(val, item => item.storedData?.temperatureExternal)
            },
            {
                label: $localize`:History chart column|History chart column title:eCO2 (ppm)`,
                yAxisID: 'eCo2Axis',
                data: this.composeDataArray(val, item => (item.storedData?.eco2Internal > 0 ? item.storedData?.eco2Internal : null))
            }]
        }
    }

    showIndoor() {
        this.manageCharts([1, 3], [2, 4]);
    }

    showOutdoor() {
        this.manageCharts([2, 4], [1, 3]);
    }

    showAll() {
        this.manageCharts([0, 1, 2, 3, 4, 5], []);
    }

    private doForEachIndex(indexes: number[], action: (index: number) => void) {
        for (let index of indexes) {
            action(index);
        }
    }

    private manageCharts(toShow: number[], toHide: number[]) {
        this.doForEachIndex(toShow, (element) => this.mainChart?.hideDataset(element, false));
        this.doForEachIndex(toHide, (element) => this.mainChart?.hideDataset(element, true));
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
                    position: 'left',
                    title: {
                        text: 'C',
                        display: true
                    }
                },
                'humidityAxis' : {
                    type: 'linear',
                    position: 'right'
                },
                'eCo2Axis' : {
                    type: 'linear',
                    position: 'center',
                    title: {
                        text: 'ppm',
                        display: true
                    }
                },
                'pressureHgAxis' : {
                    type: 'linear',
                    position: 'right',
                    title: {
                        text: 'mm Hg',
                        display: true
                    }
                }
            },
            xAxis: {
                type: "time"
            }
        },
        elements: {
            point : {
                pointStyle: 'cross'
            }
        }
    };
}
