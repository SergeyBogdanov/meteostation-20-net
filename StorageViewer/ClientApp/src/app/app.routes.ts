import { Routes } from '@angular/router';
import { ActualInfoPageComponent } from './views/actual-info-page.component';
import { HistoryPageComponent } from './views/history-page.component';
import { animation } from '@angular/animations';
import { PressureDetailsPageComponent } from './views/pressure-details-page.component';

export const routes: Routes = [
    { path: 'actual', title: 'Actual Weather Data', component: ActualInfoPageComponent, data: { animation: 'actual' } },
    { path: 'history', title: 'Historical Weather Data', component: HistoryPageComponent, data: { animation: 'history' } },
    { path: 'pressure-details', title: 'Pressure Details', component: PressureDetailsPageComponent, data: { animation: 'history' } },
    { path: '', redirectTo: '/actual', pathMatch: 'full' }
];
