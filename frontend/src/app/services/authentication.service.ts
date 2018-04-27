import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthenticationService {
  loggedIn = new BehaviorSubject<boolean>(this.tokenAvailable());
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  private tokenAvailable(): boolean {
    return !!this.oauthService.hasValidAccessToken();
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private oauthService: OAuthService
  ) {}
}
