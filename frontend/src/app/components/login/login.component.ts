import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { ElementSchemaRegistry } from '@angular/compiler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private oauthService: OAuthService, private router: Router) {}
  ngOnInit() {
    if (!this.isLoggedIn()) {
      this.oauthService.initImplicitFlow();
    } else {
      return this.router.navigate(['dashboard']);
    }
  }
  isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }
}
