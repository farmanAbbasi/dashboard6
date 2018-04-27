import { Routes } from '@angular/router';
import { LoginRoutes } from './components/login/login.route';
import { DashboardRoutes } from './components/dashboard/dashboard.route';
import { ForumRoutes } from './components/forum/forum.route';
import { LogoutRoutes } from './components/logout/logout.route';
import { PostDetailRoute } from './components/postdetails/postdetails.routes';

export const routes: Array<any> = [
  ...DashboardRoutes,
  ...ForumRoutes,
  ...LogoutRoutes,
  ...LoginRoutes,
  ...PostDetailRoute,
  {
    // fallback route
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
