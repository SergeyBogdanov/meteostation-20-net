import { Component, Input, SimpleChanges } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { DateAxisChartComponent, DateAxisChartOptions } from "../controls/date-axis-chart.component";
import { FilterPanelComponent } from "../controls/filter-panel.component";
import { HistoryService } from "../history/shared/history.service";
import moment from "moment";
import { AggregatedResult, AggregationType, HoursAggregator } from "../common/utils/hours-aggregator";
import { MeteoDataItemModel } from "../history/shared/meteo-data-item.model";

class RawMeasureData {
    constructor(public timestamp: moment.Moment, public temperature: number, public humidity: number) {}
}

interface DataExtractor {
    extractTemperature(rawData: MeteoDataItemModel) : number | undefined;
    extractHumidity(rawData: MeteoDataItemModel) : number | undefined;
}

class IndoorDataExtractor implements DataExtractor {
    extractTemperature(rawData: MeteoDataItemModel) : number | undefined {
        return rawData.storedData?.temperatureInternal;
    }

    extractHumidity(rawData: MeteoDataItemModel) : number | undefined {
        return rawData.storedData?.humidityInternal;
    }
}

const indoorDataExtractor = new IndoorDataExtractor();

class OutdoorDataExtractor implements DataExtractor {
    extractTemperature(rawData: MeteoDataItemModel) : number | undefined {
        return rawData.storedData?.temperatureExternal;
    }

    extractHumidity(rawData: MeteoDataItemModel) : number | undefined {
        return rawData.storedData?.humidityExternal;
    }
}

const outdoorDataExtractor = new OutdoorDataExtractor();

type DataSelector = (rawItem: RawMeasureData) => number;

const tempreratureSelector: DataSelector = (rawItem: RawMeasureData) => rawItem.temperature;

const humiditySelector: DataSelector = (rawItem: RawMeasureData) => rawItem.humidity;

@Component({
    selector: 'temperature-details-page',
    standalone: true,
    imports: [RouterLink, FilterPanelComponent, DateAxisChartComponent, FormsModule],
    templateUrl: 'temperature-details-page.component.html',
    styleUrl: 'temperature-details-page.component.css'
})
export class TemperatureDetailsPageComponent {
    @Input() type: 'inner' | 'outer' = 'outer';
    working : boolean = false;
    periodDuration: number = 1;
    chartData: number[] | number[][] = [];
    commonLabels: string[] = [];
    chartOptions: DateAxisChartOptions = {};
    _aggregateHours: number = 0;
    get aggregateHours() : number {
        return this._aggregateHours;
    }
    set aggregateHours(newValue: number) {
        this._aggregateHours = newValue;
        this.aggregateData();
    }
    private rawData: RawMeasureData[] = [];
    private dataExtractor: DataExtractor = outdoorDataExtractor;
    private dataSelectorProc: DataSelector = tempreratureSelector;

    constructor(private historyService: HistoryService) {}

    ngOnChanges(changes: SimpleChanges) {
        this.dataExtractor = this.type === 'inner' ? indoorDataExtractor : outdoorDataExtractor;
    }

    async onDataRequest() {
        try {
            this.working = true;
            const history = await this.historyService.getHistoryForDays(this.periodDuration);
            this.rawData = history.map(item => new RawMeasureData(
                                                            moment(item.recordTimestamp), 
                                                            this.dataExtractor.extractTemperature(item) ?? 0,
                                                            this.dataExtractor.extractHumidity(item) ?? 0));
            this.aggregateData();
        } finally {
            this.working = false;
        }
    }

    private aggregateData(): void {
        if (this.aggregateHours === 0) {
            this.chartData = this.rawData.map(item => this.dataSelectorProc(item));
            this.commonLabels = this.rawData.map(item => item.timestamp.toISOString());
            this.chartOptions = {};
        } else {
            const aggregatedAvg = this.aggregateByProc('avg');
            this.chartData = [ this.aggregateByProc('min').map(item => item.calculatedResult), 
                                this.aggregateByProc('max').map(item => item.calculatedResult),
                                aggregatedAvg.map(item => item.calculatedResult)
                            ];
            this.commonLabels = aggregatedAvg.map(item => item.timestamp.toISOString());
            this.chartOptions = { dataLabels: ['Min', 'Max', 'Avg']}
        }
    }

    private aggregateByProc(aggregationType: AggregationType): AggregatedResult[] {
        const aggregator = new HoursAggregator(this.aggregateHours);
        aggregator.type = aggregationType;
        this.rawData.forEach(item => aggregator.addData(item.timestamp, this.dataSelectorProc(item)));
        return aggregator.aggregate();
    }
}