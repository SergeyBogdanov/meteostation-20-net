import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { BaseChartDirective } from "ng2-charts";
import "chartjs-adapter-moment";

export type DateAxisChartType = 'line' | 'bar';

@Component({
    selector: 'date-axis-chart',
    standalone: true,
    imports: [BaseChartDirective],
    templateUrl: 'date-axis-chart.component.html',
    styleUrl: 'date-axis-chart.component.css'
})
export class DateAxisChartComponent {
    @Input() data: number[] = [];
    @Input() labels: Date[] | string[] = [];
    @Input() type: DateAxisChartType = 'line';
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
        let extractedData: any[] = [];
        let minAxisValue: number | undefined = undefined;
        if (this.data?.length > 0 && this.data?.length === this.labels?.length) {
            extractedData = this.data.map((item, index) => ({ x: this.labels[index], y: item}));
            if (this.type === 'bar') {
                const numericData = this.data.filter(item => !Number.isNaN(item) && item > 0);
                minAxisValue = Math.min(...numericData);
                if (Number.isFinite(minAxisValue)) {
                    const minValuePadding = ((Math.max(...numericData) - minAxisValue) * 0.10) ?? 10;
                    minAxisValue -= minValuePadding;
                }
            }
        }
        this.chartData = {
            datasets: [{
                label: false,
                data: extractedData,
                yAxisID: 'yAxis'
            }]
        };
        this.chartOptions.scales['yAxis'] = (minAxisValue !== undefined && Number.isFinite(minAxisValue)) ?
                                                { min: minAxisValue } : {};
    }

    onChartClick() {
        this.userClick.emit();
    }
}