import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DateFormattingPipe } from './../controls/date-formatting.pipe';

@Component({
  selector: '[history-item]',
  standalone: true,
  imports: [DecimalPipe, DateFormattingPipe],
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
