import moment from "moment";

class DataGroup {
    dataPoints: number[] = [];
    private endPoint: moment.Moment;

    constructor(public startPoint: moment.Moment, periodLengthHr: number) {
        this.endPoint = startPoint.clone().add(periodLengthHr, 'hours');
    }

    isApplicable(timestamp: moment.Moment): boolean {
        return timestamp.isBetween(this.startPoint, this.endPoint, undefined, '[)');
    }

    addData(data: number): void {
        this.dataPoints.push(data);
    }
}

export class AggregatedResult {
    constructor(public timestamp: moment.Moment, public calculatedResult: number) {}
}

export class HoursAggregator {
    private sourceData: DataGroup[] = [];

    constructor(private periodLengthHr: number) {}

    addData(timestamp: moment.Moment, data: number) {
        const group = this.ensureGroupFor(timestamp);
        group.addData(data);
    }

    aggregate(): AggregatedResult[] {
        return this.sourceData.map(source => new AggregatedResult(source.startPoint, this.applyAggregation(source.dataPoints)));
    }

    private applyAggregation(source: number[]): number {
        let result: number = 0;
        if (source.length > 0) {
            let sum: number = 0;
            for(let item of source) {
                sum += item;
            }
            result = sum / source.length;
        }
        return result;
    }

    private ensureGroupFor(timestamp: moment.Moment) : DataGroup {
        let result = this.sourceData.find(item => item.isApplicable(timestamp));
        if (!result) {
            result = new DataGroup(this.convertToStartPoint(timestamp), this.periodLengthHr);
            this.sourceData.push(result);
        }
        return result;
    }

    private convertToStartPoint(timestamp: moment.Moment): moment.Moment {
        const currHrs = Math.floor(timestamp.unix() / (60 * 60));
        return moment.unix((currHrs - (currHrs % this.periodLengthHr)) * (60 * 60));
    }
}