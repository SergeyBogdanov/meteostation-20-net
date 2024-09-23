import { Directive, ElementRef, Input, SimpleChanges } from "@angular/core";

@Directive({
    standalone: true,
    selector: '[airQuality]'
})
export class AirQualityDirective {
    @Input() airQuality: number = 0;
    private static applicableClasses: string[] = [
        'text-success',
        'text-success',
        'text-info',
        'text-warning',
        'text-danger',
    ];

    constructor(private element: ElementRef) {}

    ngOnChanges(changes: SimpleChanges) {
        console.log(`Air quality now is: ${this.airQuality}`);
        this.setElementClass(this.element.nativeElement?.classList, this.airQuality-1);
    }

    private setElementClass(classList: any, classIndex: number) {
        classList?.remove(
            AirQualityDirective.applicableClasses.filter((_className, index) => index !== classIndex));
        if (classIndex >= 0 && classIndex < AirQualityDirective.applicableClasses.length) {
            classList?.add(AirQualityDirective.applicableClasses[classIndex]);
        }
    }
}