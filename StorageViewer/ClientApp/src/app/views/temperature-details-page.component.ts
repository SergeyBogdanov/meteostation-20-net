import { Component, Input, SimpleChanges } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { DateAxisChartComponent, DateAxisChartOptions, AxisOptions } from "../controls/date-axis-chart.component";
import { FilterPanelComponent } from "../controls/filter-panel.component";
import { HistoryService } from "../history/shared/history.service";
import moment from "moment";
import { AggregatedResult, AggregationType, HoursAggregator } from "../common/utils/hours-aggregator";
import { MeteoDataItemModel } from "../history/shared/meteo-data-item.model";
import { BehaviourRunner, WorkingSubject } from "../common/utils/behaviour-runner";

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

type DisplayModeType = 'temp' | 'humidity' | 'both';

class AxisOptionsImpl implements AxisOptions {
    constructor(public dataLalel?: string, public groupId?: string) {}
}

@Component({
    selector: 'temperature-details-page',
    standalone: true,
    imports: [RouterLink, FilterPanelComponent, DateAxisChartComponent, FormsModule],
    templateUrl: 'temperature-details-page.component.html',
    styleUrl: 'temperature-details-page.component.css'
})
export class TemperatureDetailsPageComponent implements WorkingSubject {
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
    _displayMode: DisplayModeType = 'temp';
    get displayMode() : DisplayModeType {
        return this._displayMode;
    }
    set displayMode(newValue: DisplayModeType) {
        this._displayMode = newValue;
        this.aggregateData();
    }
    get titleFilterPanel(): string {
        return $localize`:Title of data request panel on temp details page:Request temperature & humidity data (${this.titleSourceName})`;
    }
    get titleSourceName() : string {
      return this.type === 'inner' ? $localize`:Remark for indoor sensors title:Indoor` : $localize`:Remark for outdoor sensors title:Outdoor`;
    }
    private rawData: RawMeasureData[] = [];
    private dataExtractor: DataExtractor = outdoorDataExtractor;

    constructor(private historyService: HistoryService) {}

    ngOnInit() {
        this.onDataRequest();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.dataExtractor = this.type === 'inner' ? indoorDataExtractor : outdoorDataExtractor;
    }

    async onDataRequest() {
        BehaviourRunner.runHeavyOperation(this, async () => {
            const history = await this.historyService.getHistoryForDays(this.periodDuration);
            this.rawData = history.map(item => new RawMeasureData(
                                                            moment(item.recordTimestamp), 
                                                            this.dataExtractor.extractTemperature(item) ?? 0,
                                                            this.dataExtractor.extractHumidity(item) ?? 0));
            this.aggregateData();
        });
    }

    private aggregateData(): void {
        if (this.displayMode === 'both') {
            this.displayManyAxisData();
        } else {
            this.displaySingleAxisData();
        }
    }

    private displayManyAxisData(): void {
        if (this.aggregateHours === 0) {
                this.chartData =  [
                this.rawData.map(item => humiditySelector(item)),
                this.rawData.map(item => tempreratureSelector(item))];
            this.commonLabels = this.rawData.map(item => item.timestamp.toISOString());
        } else {
            const aggregatedTemp = this.aggregateByProc('avg', tempreratureSelector);
            this.chartData =  [
                this.aggregateByProc('avg', humiditySelector).map(item => item.calculatedResult),
                aggregatedTemp.map(item => item.calculatedResult)];
            this.commonLabels = aggregatedTemp.map(item => item.timestamp.toISOString());
        }
        this.chartOptions = {axisOptions: [
          new AxisOptionsImpl($localize`:Chart data series label for humidity:Humidity`, 'humidity'),
          new AxisOptionsImpl($localize`:Chart data series label for temperature:Temperature`, 'temp')]};
    }

    private displaySingleAxisData(): void {
        const dataSelectorProc: DataSelector = this.displayMode == 'temp' ? tempreratureSelector : humiditySelector;
        if (this.aggregateHours === 0) {
            this.chartData = this.rawData.map(item => dataSelectorProc(item));
            this.commonLabels = this.rawData.map(item => item.timestamp.toISOString());
            this.chartOptions = {};
        } else {
            const aggregatedAvg = this.aggregateByProc('avg', dataSelectorProc);
            this.chartData = [ this.aggregateByProc('min', dataSelectorProc).map(item => item.calculatedResult), 
                                this.aggregateByProc('max', dataSelectorProc).map(item => item.calculatedResult),
                                aggregatedAvg.map(item => item.calculatedResult)
                            ];
            this.commonLabels = aggregatedAvg.map(item => item.timestamp.toISOString());
            this.chartOptions = { axisOptions: [
                            new AxisOptionsImpl('Min'), 
                            new AxisOptionsImpl('Max'), 
                            new AxisOptionsImpl('Avg')]};
        }
        this.chartOptions.showDaysBounds = true;
    }

    private aggregateByProc(aggregationType: AggregationType, selectProc: DataSelector): AggregatedResult[] {
        const aggregator = new HoursAggregator(this.aggregateHours);
        aggregator.type = aggregationType;
        this.rawData.forEach(item => aggregator.addData(item.timestamp, selectProc(item)));
        return aggregator.aggregate();
    }
}
