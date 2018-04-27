import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../guards/auth.guard';

export const DashboardRoutes: Array<any> = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    }
];
