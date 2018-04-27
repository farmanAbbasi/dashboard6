import { Component, OnInit, HostBinding } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  // class binding to the host element - <app-sidebar>
  @HostBinding('class.active')
  active = false;

  constructor(private authService: AuthenticationService) { }
  isLoggedIn$: Observable<boolean>;

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }
  toggleSideBar(shouldShow: boolean) {
    const sidebar = document.querySelector('#sidebar');
    if (sidebar instanceof HTMLElement) {
      if (!shouldShow) {
        sidebar.style.marginLeft = '-250px';
      } else {
        sidebar.style.marginLeft = '0px';
      }
    } else {
      throw new Error('element #test not in document');
    }
  }
}
