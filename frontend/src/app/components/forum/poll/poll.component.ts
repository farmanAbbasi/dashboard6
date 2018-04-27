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
import { TagInputModule } from 'ngx-chips';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit, OnDestroy, AfterViewInit {
 @Output() addPoll = new EventEmitter();
 // for auto focus
 @ViewChild('polltype') private elementRef: ElementRef;


  animationDuration = { enter: '0ms', leave: '0ms' };
  tagStr = '';
  requestString = 'posts/';
  arrayOption1 = '';
  arrayOption2 = '';
  arrayOption3 = '';
  arrayOption4 = '';
  pollQuestion = '';
  options: string[] = [];
  k = 1;
  curUser = '';
  o3 = false;
  o4 = false;
  statsVisible = true;
  multipleChoice = false;
  tags = [];
  requestStringTags = 'tags/searchtags/';
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
    this.pollQuestion = this.sharedservice.getText();
    this.tags = this.sharedservice.getTags();
   }
    // for autofocus
  ngAfterViewInit() {
      this.elementRef.nativeElement.focus();
  }
   public ngOnDestroy(): void {
    this.sharedservice.setText(this.pollQuestion);
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

  // function to check if there are atleast two options and a poll question before upload
  sharePoll = () => {
    if (this.pollQuestion.length === 0) {
      this.toast.error(POLL_BLANK);
    } else if (
      this.arrayOption1.length === 0 ||
      this.arrayOption2.length === 0
    ) {
      this.toast.error(POLL_OPTIONS_NEEDED);
    } else if (this.tags.length === 0) {
      this.toast.error(TAG_BLANK);

    } else {
      const pollObject = {} as Content;
      pollObject.likes = 0;
      pollObject.comments = 0;
      pollObject.content = this.firstLetterCapital(this.pollQuestion);
      this.options = [
        this.arrayOption1,
        this.arrayOption2,
        this.arrayOption3,
        this.arrayOption4
      ];
      const newarrayOfObjects = this.options.filter(
        value => Object.keys(value).length !== 0
      );
      this.tagStr = '';
      for (let i = 0; i < this.tags.length; i++) {
        if (i === 0) {
          this.tagStr += this.tags[i];
        } else {
          this.tagStr += ';' + this.tags[i];
        }
      }
      pollObject.posttype = 'poll';
      pollObject.tags = this.tagStr;
      this.curUser = this.oauthservice.getIdentityClaims()['upn'].split('@')[0];
      pollObject.userid = this.curUser;
      pollObject.choices = newarrayOfObjects;
      pollObject.multiplechoice = this.multipleChoice;
      pollObject.statsvisible = this.statsVisible;
      this.getPostService
        .httpPost(this.requestString, pollObject, null)
        .subscribe(resp => {
          if (resp.status === 200) {
            const postId = resp.body.id;
            this.getPostService.httpGet('like/createlike/' + postId).subscribe(res => {
              if (res.status === 200) {
                this.getPostService.httpPost('poll/createPoll/' + postId, { length: pollObject.choices.length }).subscribe(res2 => {
                  if (res2.status === 200) {
                    this.toast.success(POLL_UPLOADED);
                    const emitPost = pollObject;
                    emitPost['_id'] = resp.body.id;
                    emitPost['isuserliked'] = false;
                    this.addPoll.emit(emitPost);
                    this.deletePoll();
                    if (this.o4 === true) {
                      this.minusBtnClicked();
                      this.minusBtnClicked();
                    }
                    if (this.o3 === true) {
                      this.minusBtnClicked();
                    }
                  }
                });
              }
            });
          }
        });
    }
  }
  // function to empty the poll and option fields after the poll has been deleted
  deletePoll = () => {
    this.pollQuestion = '';
    this.arrayOption1 = '';
    this.arrayOption2 = '';
    this.arrayOption3 = '';
    this.arrayOption4 = '';
    // for deleting tags array
    this.tags = [];
  }
  // function to add a options field on click
  addBtnClicked = () => {
    if (this.k <= 2) {
      this.k = this.k - 1;
      if (this.k === 0) {
        this.o3 = true;
      }
      if (this.k === 1) {
        this.o4 = true;
      }
      this.k += 2;
    }
  }
  // function to remove a options field on click
  minusBtnClicked = () => {
    if (this.k === 3) {
      this.o4 = false;
      this.arrayOption3 = '';
    }
    if (this.k === 2) {
      this.o3 = false;
      this.arrayOption4 = '';
    }
    this.k--;
  }
  // function to set if stats must be visible to users or not
  isStatsVisible = () => {
    if (this.statsVisible === true) {
      this.statsVisible = false;
    } else {
      this.statsVisible = true;
    }
  }
  private specialCheck(control: FormControl) {
    if (/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(control.value)) {
      return {
        'special': true
      };
    }
    return null;
  }
  // function to set if multiple choice must be allowed or not
  isMultipleChoice = () => {
    if (this.multipleChoice === false) {
      this.multipleChoice = true;
    } else {
      this.multipleChoice = false;
    }
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
