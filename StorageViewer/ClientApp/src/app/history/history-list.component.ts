import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { HistoryItemComponent } from './history-item.component';
import { MeteoDataItemModel } from './shared/meteo-data-item.model';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'history-list',
  standalone: true,
  imports: [HistoryItemComponent, BaseChartDirective],
  templateUrl: 'history-list.component.html',
  styleUrl: 'history-list.component.css'
})
export class HistoryListComponent {
    @Input() historyRows: MeteoDataItemModel[] = [];
    @Input() actionInProgress: boolean = false;
    @ViewChildren('meteoRowElement') historyRowElements?: QueryList<HistoryItemComponent>;
    chartData: any = {
      datasets: [{
        data: [{x: '1', y: 3}, {x: '2', y: 5}, {x: '3', y: 7}]
      }]
    };
  
    onChosen(dataItem: any) {
        if (this.historyRowElements) {
          this.historyRowElements.forEach(element => {
            element.highlighted = element.item === dataItem;
          });
        }
    }
};