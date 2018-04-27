import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Content } from '../../forum/common.model';
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
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})

export class QuestionComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() addQuestion = new EventEmitter();
  // for auto focus
  @ViewChild('questiontype') private elementRef: ElementRef;
  animationDuration = { enter: '0ms', leave: '0ms' };
  tags = [];
  tagStr = '';
  curUser = '';
  question = '';
  requestString = 'posts/';
  Posts: Content;
  removeLastOnBackspace = true;
  requestStringTags = 'tags/gettags/';
  validators = [this.specialCheck];
  errorMessages = {
    'special': 'Tag cannot contain special characters'
  };
  constructor(
    public getPostService: GlobalService,
    private oauthservice: OAuthService,
    private toast: ToastrService,
    private sharedservice: SharedService
  ) {
  }

  ngOnInit() {
    this.question = this.sharedservice.getText();
    this.tags = this.sharedservice.getTags();
   }
   // for autofocus
   ngAfterViewInit() {
      this.elementRef.nativeElement.focus();
  }
   ngOnDestroy() {
    this.sharedservice.setText(this.question);
    this.sharedservice.setTags(this.tags);
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

  // function to check if atleast one tag and question has been entered before upload
  validationPost = () => {
    if (this.question.length === 0) {
      this.toast.error(POST_BLANK);
    } else if (this.tags.length === 0) {
      this.toast.error(TAG_BLANK);
    } else {
      this.upload();
      this.toast.success(POST_UPLOADED);

    }
  }

  // function to upload the question Object
  upload = () => {
    const questionObject = {} as Content;
    questionObject.likes = 0;
    questionObject.comments = 0;
    questionObject.posttype = 'question';
    this.curUser = this.oauthservice.getIdentityClaims()['upn'].split('@')[0];
    questionObject.userid = this.curUser;
    questionObject.bestAnswer = null;
    if (this.question[this.question.length - 1] !== '?') {
      this.question = this.question + '?';
    }
    questionObject.content = this.firstLetterCapital(this.question);
    this.tagStr = '';
    for (let i = 0; i < this.tags.length; i++) {
      if (i === 0) {
        this.tagStr += this.tags[i];
      } else {
        this.tagStr += ';' + this.tags[i];
      }
    }
    questionObject.tags = this.tagStr;

    this.getPostService
      .httpPost(this.requestString, questionObject)
      .subscribe(resp => {
        if (resp.status === 200) {
          this.getPostService
            .httpGet('like/createlike/' + resp.body.id)
            .subscribe(data => {
              if (data.status === 200) {
                this.deleteQuestion();
                const emitPost = questionObject;
                emitPost['_id'] = resp.body.id;
                emitPost['isuserliked'] = false;
                this.addQuestion.emit(emitPost);
              }
            });
        }
      });
  }
  // function to empty the question field and tags field after upload
  deleteQuestion = () => {
    this.question = '';
    this.tags = [];
  }
  private specialCheck(control: FormControl) {
    if (/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(control.value)) {
      return {
        'special': true
      };
    }
    return null;
  }

  firstLetterCapital(string) {
  const stringarray = string.split('.');
  for ( let i = 0; i < stringarray.length; i++) {
   stringarray[i] = stringarray[i].replace(stringarray[i].charAt(0), stringarray[i].charAt(0).toUpperCase() );
  if (i === 0) {
    string = stringarray[i] + '. ' ;
  } else if ( i !== (stringarray.length - 1)) {
    string  = string + stringarray[i] + '. ';
  } else if ( i === (stringarray.length)) {
    string = string + stringarray[i];
  }
 }
return string;
}


}

