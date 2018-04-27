import { Route } from '@angular/router';
import { ForumComponent } from './forum.component';
import { AuthGuard } from '../../guards/auth.guard';

export const ForumRoutes: Array<any> = [
  {
    path: 'forum',
    component: ForumComponent,
    canActivate: [AuthGuard]
  }
];
