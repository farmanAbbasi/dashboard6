import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { People } from '../components/most-connected/most-connected.interface';

@Injectable()
export class MostConnectedService {
  person: People[];
  list: any;

  constructor(private http: HttpClient) {}
  private tagUrl = '../assets/most_connected.json'; // URL to web api
  /** GET heroes from the server */
  getPeople(): Observable<People[]> {
    return this.http.get<People[]>('../assets/most_connected.json');
  }
}
