import { Injectable, ChangeDetectorRef } from '@angular/core';
import { GlobalService } from './global.service';
import { UserImageCache } from '../models/user-image.model';
import { UserNameCache } from '../models/user-name.model';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserdataService {
  userImageCache: Map<String, UserImageCache> = new Map<String, UserImageCache>();
  userNameCache: Map<String, UserNameCache> = new Map<String, UserNameCache>();

  constructor(private globalService: GlobalService) {}

  public fetchUserName(userId: String): Observable<any> {
    if (this.userNameCache.has(userId)) {
      return Observable.of(this.userNameCache.get(userId));
    } else {
      const newUser = new UserNameCache();
      newUser.userId = userId.trim();
      this.globalService
        .httpGetDefault(
          'https://graph.microsoft.com/beta/users/' +
            userId.trim() +
            '@teksystems.com',
          'json'
        )
        .subscribe(
          (userData: any) => {
            try {
              newUser.userName = userData.givenName + ' ' + userData.surname;
            } catch (error) {
              newUser.userName = 'Not Available';
            }
          },
          error => {
            newUser.userName = 'Not Available';
            return Observable.of(newUser);
          }
        );
      this.userNameCache.set(userId, newUser);
      return Observable.of(newUser);
    }
  }

  public fetchUserImage(userId: String): Observable<any> {
    if (this.userImageCache.has(userId)) {
      return Observable.of(this.userImageCache.get(userId));
    } else {
      const newUser = new UserImageCache();
      newUser.userId = userId.trim();
      newUser.userImage = '../../../assets/images/icons/header/default.png';
      this.globalService
        .httpGetDefault(
          'https://graph.microsoft.com/beta/users/' +
            userId.trim() +
            '@teksystems.com/photos/48x48/$value',
          'Blob'
        )
        .subscribe(
          (data: any) => {
            const reader = new FileReader();
            reader.addEventListener(
              'load',
              () => {
                newUser.userImage = reader.result;
              },
              false
            );
            reader.readAsDataURL(data);
          },
          error => {
            return Observable.of(newUser);
          }
        );
      this.userImageCache.set(userId, newUser);
      return Observable.of(newUser);
    }
  }
  handleError(error) {
    console.log(error);
  }
}
