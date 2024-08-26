import { Component, Input } from '@angular/core';

@Component({
  selector: 'filter-panel',
  standalone: true,
  templateUrl: 'filter-panel.component.html',
  styleUrl: 'filter-panel.component.css'
})
export class FilterPanelComponent {
    @Input() title?: string;
    
    get hasTitle(): boolean {
        return !!this.title;
    }

};