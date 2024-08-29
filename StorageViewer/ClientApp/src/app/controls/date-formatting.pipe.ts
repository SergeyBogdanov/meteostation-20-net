import { Pipe, PipeTransform } from "@angular/core";

type DateFormatEnum = 'full' | 'short';
/*
 * Reformat input value (as string) to formatted date and time
 * Usage:
 *   value | dateFormatting:formatEnum(full|short)
 * Example:
 *   {{ '2024-01-01T21:38:30' | dateFormatting:'full' }}
 *   formats to: 8/29/2024 3:05:03 AM
 */
@Pipe({
    name: 'dateFormatting',
    standalone: true
})
export class DateFormattingPipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        let result = value;
        let [format] = this.getApplicableOptions(args);
        if (typeof value === 'string') {
            const parsedDate = Date.parse(value);
            if (!Number.isNaN(parsedDate)) {
                const dateTyped = new Date(parsedDate);
                result = format !== 'full' ? dateTyped.toLocaleString() :
                                dateTyped.toLocaleDateString() + ' ' + dateTyped.toLocaleTimeString();
            }
        }
        return result;
    }

    private getApplicableOptions(args: any[]): [DateFormatEnum] {
        let normalizedFormat: DateFormatEnum = 'full';
        if (args?.length > 0 && (args[0] === 'full' || args[0] === 'short')) {
            normalizedFormat = args[0];
        }
        return [normalizedFormat];
    }
};


