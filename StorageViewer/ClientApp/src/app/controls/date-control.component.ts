import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'date-control',
  standalone: true,
  imports: [FormsModule],
  templateUrl: 'date-control.component.html',
  styleUrl: 'date-control.component.css'
})
export class DateControlComponent {
    @Input() labeledId?: string;
    @Input() value?: Date;
    @Output() valueChange = new EventEmitter<Date>();
    enteredValue?: string;

    onEnteredValueChanged(event: any) {
        if (this.enteredValue) {
            const parsedDate = Date.parse(this.enteredValue);
            if (!Number.isNaN(parsedDate)) {
                this.value = new Date(parsedDate);
                this.valueChange.emit(this.value);
            }
        }
    }
};