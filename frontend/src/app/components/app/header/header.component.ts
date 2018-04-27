import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { Observable } from 'rxjs/Observable';
import { OAuthService } from 'angular-oauth2-oidc';
import { GlobalService } from '../../../services/global.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AppComponent } from '../../../app.component';
import { Router } from '@angular/router';
import { UserdataService } from '../../../services/userdata.service';
import { TranslateService } from '../../../modules/internationalization/translate.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  tooltipPosition = 'right';
  userDisplayName: String;
  userImageLoading = true;
  shouldShow = true;
  content;
  sidebar;
  messages = [];
  private userImage: any = '';
  constructor(
    public http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private authService: AuthenticationService,
    private oauthService: OAuthService,
    private gs: GlobalService,
    private translator: TranslateService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.authService.getLoggedInName.subscribe(name => this.changeName(name));
    this.sidebar = new SidebarComponent(this.authService);
    this.content = new AppComponent(
      this.oauthService,
      this.router,
      this.authService,
      this.translator
    );
    this.fetchNotifications();
    try {
      this.userDisplayName =
        this.oauthService.getIdentityClaims()['given_name'] +
        ' ' +
        this.oauthService.getIdentityClaims()['family_name'];
    } catch (error) {}
    try {
      if (this.oauthService.hasValidAccessToken()) {
        this.http
          .get('https://graph.microsoft.com/beta/me/photos/48x48/$value', {
            headers: new HttpHeaders({
              Authorization: 'Bearer ' + this.oauthService.getAccessToken()
            }),
            responseType: 'blob'
          })
          .subscribe((data: any) => {
            const reader = new FileReader();
            reader.addEventListener(
              'load',
              () => {
                this.userImage = reader.result;
                this.cdRef.detectChanges();
              },
              false
            );
            reader.readAsDataURL(data);
          });
        this.authService.loggedIn.next(true);
      }
    } catch (error) {}
  }
  toggleSideBar() {
    this.shouldShow = !this.shouldShow;
    this.sidebar.toggleSideBar(this.shouldShow);
    this.content.toggleSideBar(this.shouldShow);
  }
  userLogout() {
    return this.oauthService.logOut();
  }
  private changeName(name: string): void {
    this.userDisplayName = name;
  }

  toggleSearch() {
    const searchInput = document.querySelector('#search-input');
    const appRoot = document.querySelector('#app-root');
    if (searchInput instanceof HTMLElement) {
      searchInput.classList.add('show');
      if (appRoot instanceof HTMLElement) {
        appRoot.className += 'rotate-layout with-search';
      } else {
        throw new Error('element #app-root not in document');
      }
    } else {
      throw new Error('element #search-input not in document');
    }
  }

  changeLanguage(option) {
    this.translator.use(option);
  }
  fetchNotifications() {
    this.notificationService.getNotifications().subscribe(data => {
      this.messages.push(data);
    });
  }
}
