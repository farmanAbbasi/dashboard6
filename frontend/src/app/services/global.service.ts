import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Content } from '../components/forum/common.model';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class GlobalService {
  _baseUrl: any = 'http://localhost:3000/api/';
  constructor(public http: HttpClient, private oauthService: OAuthService) {}

  public httpGet(requestString): Observable<HttpResponse<any>> {
    return this.http.get(this._baseUrl + requestString, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.oauthService.getAccessToken()
      }), observe: 'response'
    });
  }
  public httpGetDefault(requestString, responseType): Observable<any> {
    return this.http
      .get(requestString, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.oauthService.getAccessToken()
        }),
        responseType: responseType
      })
      .catch((error: any) => Observable.throw('error'));
  }

  public httpPost(
    requestString: string,
    body: Object = {},
    options: Object = {}
  ): Observable<HttpResponse<any>> {
    return this.http.post(this._baseUrl + requestString, body, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.oauthService.getAccessToken()
      }), observe: 'response'
    });
  }

  public httpDelete(requestString: string, body): Observable<HttpResponse<any>> {
    return this.http.delete(this._baseUrl + requestString + body, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.oauthService.getAccessToken()
      }), observe: 'response'
    });
  }

  public httpUpdate(requestString: string, body): Observable<any> {
    return this.http.put(this._baseUrl + requestString + body, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.oauthService.getAccessToken()
      })
    });
  }
}
