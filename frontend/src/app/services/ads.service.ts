import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { AdsContent } from '../components/ads/ads.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AdsService {
  constructor(private httpclient: HttpClient) {}

  fetchPost(): Observable<AdsContent[]> {
    return this.httpclient.get<AdsContent[]>('http://localhost:3000/api/ads/');
  }
}
