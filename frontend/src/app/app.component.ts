import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {
  OAuthService,
  JwksValidationHandler,
  OAuthEvent
} from 'angular-oauth2-oidc';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { authConfig } from './auth.config';
import { TranslateService } from './modules/internationalization/translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private authService: AuthenticationService,
    private translator: TranslateService
  ) {
    translator.use('en');
  }
  ngOnInit() {
    this.configureWithNewConfigApi();
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  private configureWithNewConfigApi() {
    this.oauthService.configure(authConfig);
    this.oauthService.setStorage(localStorage);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.events.subscribe(({ type }: OAuthEvent) => {
      switch (type) {
        case 'token_received':
          this.authService.loggedIn.next(true);
          this.authService.getLoggedInName.emit(
            this.oauthService.getIdentityClaims()['given_name'] +
            ' ' +
            this.oauthService.getIdentityClaims()['family_name']
          );
          return this.router.navigate(['dashboard']);
      }
    });
    this.oauthService.tryLogin().then(() => {
      this.oauthService.setupAutomaticSilentRefresh();
    });
  }

  toggleSideBar(shouldShow: boolean) {
    const sidebar = document.querySelector('.main');
    if (sidebar instanceof HTMLElement) {
      if (!shouldShow) {
        sidebar.classList.remove('wrapped');
      } else {
        sidebar.classList.add('wrapped');
      }
    } else {
      throw new Error('element #test not in document');
    }
  }

}
