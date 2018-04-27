import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Notification } from '../models/notification.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observer } from 'rxjs/Observer';
import { map, catchError } from 'rxjs/operators';
import * as socketIo from 'socket.io-client';
import { Socket } from '../models/notification.interface';

declare var io: {
  connect(url: string): Socket;
};

@Injectable()
export class NotificationService {
  private socket: SocketIOClient.Socket;
  // socket: Socket;
  private url = 'http://localhost:3000';
  constructor(private httpclient: HttpClient) {}

  getNotifications() {
    this.socket = socketIo(this.url);

    return new Observable<Notification>(observer => {
      this.socket.on('notificationCreated', data => {
        observer.next(data);
      });
    });
  }
  private handleError(error) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
      const errMessage = error.error.message;
      return Observable.throw(errMessage);
    }
    return Observable.throw(error || 'Socket.io server error');
  }
}
