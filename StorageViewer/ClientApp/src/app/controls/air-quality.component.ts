import { Component, Input } from "@angular/core";

@Component({
    selector: 'air-quality',
    standalone: true,
    templateUrl: 'air-quality.component.html',
    styleUrl: 'air-quality.component.css'
})
export class AirQualityComponent {
    @Input({ required: true }) qualityIndex!: number;
}