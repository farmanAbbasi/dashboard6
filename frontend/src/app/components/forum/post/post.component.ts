import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ElementRef, ViewChild, AfterViewInit, } from '@angular/core';
import { Content } from '../../forum/common.model';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {
  DONE,
  ERROR_MSG,
  POLL_OPTIONS_NEEDED,
  POLL_UPLOADED,
  POST_UPLOADED,
  POST_BLANK,
  POLL_BLANK,
  TAG_BLANK
} from '../../../../const';
import { GlobalService } from '../../../services/global.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() addPost = new EventEmitter();
  curUser = '';
  tagStr = '';
  post = '';
  requestString = 'posts/';
  Posts: Content;
  maxTags = 5;
  animationDuration = { enter: '0ms', leave: '0ms' };
  tags = [];
  // for autoFocus
  @ViewChild('posttype') private elementRef: ElementRef;
  requestStringTags = 'tags/gettags/';
  validators = [this.specialCheck];
  errorMessages = {
    'special': 'Tag cannot contain special characters'
  };

  constructor(
    public getPostService: GlobalService,
    private oauthservice: OAuthService,
    private toast: ToastrService,
    private sharedservice: SharedService,
    public http: HttpClient
  ) { }

  ngOnInit() {
    this.post = this.sharedservice.getText();
    this.tags = this.sharedservice.getTags();
  }
  // for autofocus
  ngAfterViewInit() {
    this.elementRef.nativeElement.focus();
  }

  ngOnDestroy() {
    this.sharedservice.setText(this.post);
    this.sharedservice.setTags(this.tags);
  }
  // function to check if atleast one tag and post has been entered before upload
  validationPost = () => {
    if (this.post.length === 0) {
      this.toast.error(POST_BLANK);
    } else if (this.tags.length === 0) {
      this.toast.error(TAG_BLANK);
    } else {
      this.upload();
    }
  }

  public requestAutocompleteItems = (text: string): Observable<Response> => {
    const url = `tags/searchtags/${text}`;
    return new Observable<Response>(observer => {
      this.getPostService.httpGet(url).subscribe(data => {
        if (data.status === 200) {
          observer.next(data.body.tags);
        } else {
          observer.next(data.body.tags);
        }
      });
    });
  }

  // function to upload the post Object
  upload = () => {
    const postObject = {} as Content;
    postObject.likes = 0;
    postObject.comments = 0;
    postObject.posttype = 'post';
    this.curUser = this.oauthservice.getIdentityClaims()['upn'].split('@')[0];
    postObject.userid = this.curUser;
    postObject.content = this.firstLetterCapital(this.post);
    this.tagStr = '';
    for (let i = 0; i < this.tags.length; i++) {
      if (i === 0) {
        this.tagStr += this.tags[i];
      } else {
        this.tagStr += ';' + this.tags[i];
      }
    }
    postObject.tags = this.tagStr;
    this.tagStr = '';
    this.getPostService
      .httpPost(this.requestString, postObject)
      .subscribe(resp => {
        if (resp.status === 200) {
          this.getPostService.httpGet('like/createlike/' + resp.body.id).subscribe(res => {
            if (res.status === 200) {
              const emitPost = postObject;
              emitPost['_id'] = resp.body.id;
              emitPost['isuserliked'] = false;
              this.addPost.emit(emitPost);
              if (resp.body.tags.length === 1) {
                this.tags = resp.body.tags;
              } else {
                this.tags = resp.body.tags.split(';');
              }
              const sortedTags = this.tags.sort();
              const tagObject = { tags: [] };
              let currentVal: String;
              let tempTagArray: String[] = [];
              currentVal = sortedTags[0].toLowerCase().trim().charAt(0);
              for (let i = 0; i < sortedTags.length; i++) {
                if (sortedTags[i].toLowerCase().trim().charAt(0) === currentVal) {
                  tempTagArray.push(sortedTags[i]);
                  if (i === (sortedTags.length - 1)) {
                    tagObject.tags.push(tempTagArray);
                  }
                } else {
                  tagObject.tags.push(tempTagArray);
                  tempTagArray = [];
                  currentVal = sortedTags[i].toLowerCase().trim().charAt(0);
                  tempTagArray.push(sortedTags[i]);
                  if (i === (sortedTags.length - 1)) {
                    tagObject.tags.push(tempTagArray);
                  }
                }
              }
              this.getPostService.httpPost('tags/createtag/', tagObject).subscribe(res2 => {
                if (res2.status === 200) {
                  this.toast.success(POST_UPLOADED);
                  this.tags = [];
                }
              });
            }
          });
        }
      });
    this.deletePost();
  }
  // function to empty the post field and tags field after upload
  deletePost = () => {
    this.post = '';
    this.tags = [];
  }
  firstLetterCapital(string) {
    const stringarray = string.split('.');
    for (let i = 0; i < stringarray.length; i++) {
      stringarray[i] = stringarray[i].replace(
        stringarray[i].charAt(0),
        stringarray[i].charAt(0).toUpperCase()
      );
      if (i === 0) {
        string = stringarray[i] + '. ';
      } else if (i !== stringarray.length - 1) {
        string = string + stringarray[i] + '. ';
      } else if (i === stringarray.length) {
        string = string + stringarray[i];
      }
    }
    return string;
  }
  private specialCheck(control: FormControl) {
    if (/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(control.value)) {
      return {
        'special': true
      };
    }
    return null;
  }
}
