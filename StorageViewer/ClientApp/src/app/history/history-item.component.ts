import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: '[history-item]',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: 'history-item.component.html',
  styleUrl: 'history-item.component.css'
})
export class HistoryItemComponent {
    @Input() item: any;
    @Input() highlighted: boolean = false;
    @Output() chosen = new EventEmitter();

    onTextClick() {
        this.chosen.emit();
    }
};
