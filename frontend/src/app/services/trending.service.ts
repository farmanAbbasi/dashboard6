import { Injectable } from '@angular/core';
import { Trend } from '../components/trending/trending.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TrendingService {
  jsonUrl = '../assets/trending.json';
  trends: Trend[];

  constructor(private http: HttpClient) {}

  // Reading data from json and returning
  getTrends(): Observable<Trend[]> {
    return this.http.get<Trend[]>(this.jsonUrl);
  }
}
