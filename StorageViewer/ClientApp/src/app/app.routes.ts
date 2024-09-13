import { Routes } from '@angular/router';
import { ActualInfoPageComponent } from './views/actual-info-page.component';
import { HistoryPageComponent } from './views/history-page.component';

export const routes: Routes = [
    { path: 'actual', title: 'Actual Weather Data', component: ActualInfoPageComponent },
    { path: 'history', title: 'Historical Weather Data', component: HistoryPageComponent },
    { path: '', redirectTo: '/actual', pathMatch: 'full' }
];
