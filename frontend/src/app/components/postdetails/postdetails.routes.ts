import { Route } from '@angular/router';
import { PostdetailsComponent } from './postdetails.component';
import { AuthGuard } from '../../guards/auth.guard';

export const PostDetailRoute : Array<any> =[
    {
        path: ':id', 
        component : PostdetailsComponent,
        canActivate : [AuthGuard]
    }
] 