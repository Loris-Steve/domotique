import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HistoryComponent } from './pages/history/history.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'history', component: HistoryComponent },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    { path: '**', component: DashboardComponent }
];
