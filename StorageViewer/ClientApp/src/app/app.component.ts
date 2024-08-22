import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from '@angular/forms';

import { HistoryListComponent } from './history/history-list.component'
import { DateControlComponent } from './controls/date-control.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HistoryListComponent, DateControlComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ClientApp';
  responseText = '';
  enteredText = '';
  historyRows: any[] = [];
  fromDateFilter?: Date;
  toDateFilter?: Date;
  @ViewChild('historyList') historyListElement?: HistoryListComponent;

  constructor(private client : HttpClient) {}

  makeApiCall() {
    console.log('Would make API call here');
    this.client.get('api/History/all').subscribe(
      res => {
        this.responseText = JSON.stringify(res);
        if (Array.isArray(res)) {
          this.historyRows = res;
        }
      }); 
  }

  async onSearch() {
    await this.historyListElement?.searchHistory({
      fromDate: this.fromDateFilter,
      toDate: this.toDateFilter
    });
  }
}
