import { Routes } from '@angular/router';
import { ActualInfoPageComponent } from './views/actual-info-page.component';
import { HistoryPageComponent } from './views/history-page.component';

export const routes: Routes = [
    { path: 'actual/:cnt', title: 'Actual Weather Data', component: ActualInfoPageComponent },
    { path: 'history', component: HistoryPageComponent },
    { path: '', redirectTo: '/actual/1', pathMatch: 'full' }
];
