import { Component, Input } from '@angular/core';

@Component({
  selector: 'actual-info-page',
  standalone: true,
  templateUrl: 'actual-info-page.component.html',
  styleUrl: 'actual-info-page.component.css'
})
export class ActualInfoPageComponent {
    @Input() cnt: number = 0;
};