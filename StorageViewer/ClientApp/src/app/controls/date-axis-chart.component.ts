import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { BaseChartDirective } from "ng2-charts";
import "chartjs-adapter-moment";
import moment from "moment";
import _ from 'lodash';
import { isNullOrUndef } from "chart.js/helpers";

class DataPoint {
    constructor(public x: string, public y: number) {}
}

const DEFAULT_AXIS_ID: string = 'yAxis';

class RawDataset {
    constructor(public dataPoints: DataPoint[], public buttonLevel: number | undefined, public axisId: string) {}
}

export type DateAxisChartType = 'line' | 'bar';

export interface AxisOptions {
    dataLalel?: string;
    groupId?: string;
}

export interface DateAxisChartOptions {
    axisOptions?: AxisOptions[];
}

@Component({
    selector: 'date-axis-chart',
    standalone: true,
    imports: [BaseChartDirective],
    templateUrl: 'date-axis-chart.component.html',
    styleUrl: 'date-axis-chart.component.css'
})
export class DateAxisChartComponent {
    @Input() data: number[] | number[][] = [];
    @Input() labels: Date[] | string[] = [];
    @Input() type: DateAxisChartType = 'line';
    @Input() options: DateAxisChartOptions = {};
    @Output() userClick = new EventEmitter<void>();
    chartData: any = {
        datasets: [{
            label: false,
            data: [{x: '1', y: 2}, {x: '2', y: 5}, {x: '3', y: 1}],
            yAxisID: 'yAxis'
        }]
    }
    chartOptions: any = {
        scales: {
            xAxis: {
                type: "time"
            },
            yAxis: {}
        },
        plugins: {
            legend: {
                display: false
            }
        },
        elements: {
            point : {
                radius: 0
            }
        }
    };

    ngOnChanges(changes: SimpleChanges) {
        const extractedData: RawDataset[] = this.extractData();
        this.chartData = {
            datasets: extractedData.map((raw, index) => ({
                label: this.getLabel(index),
                data: raw.dataPoints,
                yAxisID: raw.axisId
            }))
        };
        const groupedByAxisId = _.groupBy(extractedData, data => data.axisId);
        const axisMinLevels = _.transform(groupedByAxisId, (result: any, rawSet, axisId) => result[axisId] = this.extractMinLevel(rawSet), {});
        for(let axisId in axisMinLevels) {
            this.chartOptions.scales['yAxis'] = (!_.isUndefined(axisMinLevels[axisId])) ? { min: axisMinLevels[axisId] } : {};
        }
        this.chartOptions.plugins.legend.display = (this.chartData.datasets as any[]).find(item => !!item.label) !== undefined;
    }

    private extractMinLevel(rawSet: RawDataset[]): number | undefined {
        return _.chain(rawSet).map(set => set.buttonLevel).min().value();
    }

    onChartClick() {
        this.userClick.emit();
    }

    private extractData(): RawDataset[] {
        let normalizedData: number[][] = this.getNormalizedData();
        let result: RawDataset[] = [];
        if (this.everyDataHasLabels(normalizedData)) {
            result = normalizedData.map((rawData, index) => this.convertToDataset(rawData, index));
        }
        if (result.length === 0) {
            result.push(new RawDataset([], undefined, DEFAULT_AXIS_ID));
        }
        return result;
    }

    private getNormalizedData(): number[][] {
        return (this.data?.length > 0 && !Array.isArray(this.data[0])) ? [ this.data ] :
                (this.data?.length > 0 && Array.isArray(this.data[0])) ? this.data as any :
                    [];
    }

    private everyDataHasLabels(dataBlocks: number[][]): boolean {
        let result: boolean = true;
        for(let block of dataBlocks) {
            result &&= (block.length === this.labels?.length);
            if (!result) {
                break;
            }
        }
        return result;
    }

    private convertToDataset(rawData: number[], datasetIndex: number): RawDataset {
        return new RawDataset(rawData.map((item, index) => new DataPoint(this.representAsString(this.labels[index]), item)),
                        this.determinateButtomLevel(rawData),
                        this.determinateAxisId(datasetIndex));
    }

    private representAsString(label: string | Date): string {
        return moment.isDate(label) ? moment(label).toISOString() : label;
    }

    private determinateButtomLevel(data: number[]): number | undefined {
        let minAxisValue: number | undefined = undefined;
        if (this.type === 'bar') {
            const numericData = data.filter(item => !Number.isNaN(item) && item > 0);
            minAxisValue = Math.min(...numericData);
            if (Number.isFinite(minAxisValue)) {
                const minValuePadding = ((Math.max(...numericData) - minAxisValue) * 0.10) ?? 10;
                minAxisValue -= minValuePadding;
            }
        }
        return minAxisValue;
    }

    private getLabel(index: number): string | boolean {
        return (!isNullOrUndef(this.options?.axisOptions?.[index]?.dataLalel)) ?
                    this.options.axisOptions[index].dataLalel : false;
    }

    private determinateAxisId(index: number): string {
        return isNullOrUndef(this.options?.axisOptions?.[index]?.groupId) ?
                DEFAULT_AXIS_ID :
                this.options.axisOptions[index].groupId;
    }
}