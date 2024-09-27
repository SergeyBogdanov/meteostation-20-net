import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { HistoryItemComponent } from './history-item.component';
import { MeteoDataItemModel } from './shared/meteo-data-item.model';

@Component({
  selector: 'history-list',
  standalone: true,
  imports: [HistoryItemComponent],
  templateUrl: 'history-list.component.html',
  styleUrl: 'history-list.component.css'
})
export class HistoryListComponent {
    @Input() historyRows: MeteoDataItemModel[] = [];
    @Input() actionInProgress: boolean = false;
    @ViewChildren('meteoRowElement') historyRowElements?: QueryList<HistoryItemComponent>;
  
    onChosen(dataItem: any) {
        if (this.historyRowElements) {
          this.historyRowElements.forEach(element => {
            element.highlighted = element.item === dataItem;
          });
        }
    }
};