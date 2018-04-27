import {
  Component,
  OnInit,
  Pipe,
  PipeTransform,
  Output,
  EventEmitter,
  ElementRef,
  Inject,
  ViewChild,
  ViewChildren,
  OnDestroy
} from '@angular/core';
import {
  Content,
  AnswerResponseModel,
  CommentModel,
  CommentModelGet,
  VoteModel
} from '../forum/common.model';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DatePipe } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';
import {
  AfterContentInit,
  ContentChild,
  AfterViewChecked,
  AfterViewInit,
  Renderer2
} from '@angular/core';
import {
  DONE,
  ERROR_MSG,
  POLL_OPTIONS_NEEDED,
  POLL_UPLOADED,
  POST_UPLOADED,
  POST_BLANK,
  POLL_BLANK,
  COMMENT_UPLOADED,
  ENTER_COMMENT
} from '../../../const';
import { GlobalService } from '../../services/global.service';
import { UserdataService } from '../../services/userdata.service';
import { ToastrService } from 'ngx-toastr';
import { Console } from '@angular/core/src/console';
import { SharedService } from '../../services/shared.service';
@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit, OnDestroy {
  @ViewChild('toComment') private toComment: ElementRef;
  requestStringPost: String = 'posts/';
  requestStringPoll = 'poll/';
  smallTextComment: Boolean = true;
  commentgetarray: CommentModelGet;
  color = ['#d5dce8', '#d5dce8', '#d5dce8', '#d5dce8'];
  commentarray: CommentModelGet['comments'];
  response: Response;
  len: any;
  boolT: boolean;
  currentcommentid: string;
  currentselectedid: string;
  userDisplayName: string;
  userId: string;
  requestStringbestAnswer: string; // flags to show/unshow poll/post
  questionResponseFlag = false;
  viewAnswersFlag = false;
  answerButtonFlag = true;
  date: Date = new Date();
  flagForPost = true;
  flagForPoll = false;
  flagForQuestion = false;
  bestAnswer: String = '';
  bestAnswerSelectedFlag: Boolean = false;
  comment: String;
  commentObject = {} as CommentModel;
  smallTextEditor = true;
  selectedPost = 'post';
  data: string;
  AnswerObj = {} as AnswerResponseModel;
  Object = {} as Content;
  commentobject = {} as CommentModelGet;
  options: string[] = [];
  answer = '';
  tagsOn = false;
  statsVisible = true;
  multipleChoice = false;
  postTypeValue = '';
  requestStringAnswer = 'question/';
  requestStringComment = 'comments/';
  position = 'above';
  tags = '';
  // Array to store tags
  Tags = [];
  answerarray: [AnswerResponseModel];
  Posts: Content[] = [];
  likeicon = false;
  post = '';
  private noOfItemsToShowInitially = 5;
  private itemsToLoad = 5;
  private noOfItemsToSkip = 0;
  requestString = 'posts?skip=' +
    this.noOfItemsToSkip +
    '&limit=' +
    this.itemsToLoad;
  public isFullListDisplayed = false;
  tagsArray = [];
  maxNoOfTags = 5;
  tagSeparated = [];
  requestStringLike = 'like/';
  User = '';
  userImage = '';

  ngOnInit() {
    try {
      this.User =
        this.oauthservice.getIdentityClaims()['given_name'] +
        ' ' +
        this.oauthservice.getIdentityClaims()['family_name'];
      this.userId = this.oauthservice.getIdentityClaims()['unique_name'];
      this.userId = this.userId.substring(0, this.userId.lastIndexOf('@'));
    } catch (error) { }
    this.getPostService.httpGet(this.requestString).subscribe((data: any) => {
      if (data.body != null) {
        const posts: any = data.body.map(post => {
          post.width = [];
          this.tagsArray.push(post.tags);
          this.tagSeparated.push(post.tags.split(';'));
          return post;
        });
        this.Posts = posts;
        this.len = this.Posts.length;
      }
    });
    try {
      this.userDisplayName =
        this.oauthservice.getIdentityClaims()['given_name'] +
        ' ' +
        this.oauthservice.getIdentityClaims()['family_name'];
    } catch (error) { }
  }

  ngOnDestroy() {
    this.sharedService.setText('');
    this.sharedService.setTags(null);
  }

  constructor(
    private getPostService: GlobalService,
    public datepipe: DatePipe,
    public oauthservice: OAuthService,
    private userDataService: UserdataService,
    private toast: ToastrService,
    private sharedService: SharedService
  ) { }
  diff_minutes(dt2, dt1) {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    const min = Math.abs(Math.round(diff));
    if (min > 59) {
      const hr = Math.abs(Math.round(min / 60));
      if (hr > 23) {
        const day = Math.abs(Math.round(hr / 24));
        return (day === 1 ? '1 day ago' : Math.abs(Math.round(day)) + ' days ago');
      }
      return (hr === 1 ? '1 hour ago' : Math.abs(Math.round(hr)) + ' hours ago');
    }
    return (min === 0 ? 'Just now' : (min === 1 ? '1 min ago' : Math.abs(Math.round(min)) + ' mins ago'));
  }
  dateFinder(date) {
    if (date != null) {
      const currentTime = new Date();
      return this.diff_minutes(currentTime, date);
    }
  }
  focusHere() {
    setTimeout(() => this.toComment.nativeElement.focus(), 0);
  }
  deletePost(post, index) {
    this.getPostService.httpDelete('posts/', post._id).subscribe(data => {
      if (data.status === 200) {
        this.getPostService.httpDelete('like/', post._id).subscribe(subData => {
          if (subData.status === 200) {
            this.getPostService.httpDelete('comments/', post._id).subscribe((cRes) => {
              if (cRes.status === 200) {
                if (post.posttype === 'poll') {
                  this.getPostService
                    .httpDelete('poll/', post._id)
                    .subscribe(nestSubData => {
                      if (nestSubData.status === 200) {
                        if (index > -1) {
                          this.Posts.splice(index, 1);
                          this.tagsArray.splice(index, 1);
                          this.tagSeparated.splice(index, 1);
                          this.toast.success('Post deleted successfully');
                        }
                      }
                    });
                } else if (post.posttype === 'question') {
                  this.getPostService.httpDelete('question/', post._id).subscribe((qRes) => {
                    if (qRes.status === 200) {
                      if (index > -1) {
                        this.Posts.splice(index, 1);
                        this.tagsArray.splice(index, 1);
                        this.tagSeparated.splice(index, 1);
                        this.toast.success('Post deleted successfully');
                      }
                    }
                  });
                } else {
                  if (index > -1) {
                    this.Posts.splice(index, 1);
                    this.tagsArray.splice(index, 1);
                    this.tagSeparated.splice(index, 1);
                    this.toast.success('Post deleted successfully');
                  }
                }
              }
            });
          }
        });
      }
    });
  }
  deleteComment(idd, commentId, objId, index) {

    this.getPostService.httpDelete('comments/' + objId + '/', commentId).subscribe(Data => {
      if (Data.status === 200) {
        idd.comments -= 1;
        this.commentarray.splice(index, 1);
        if (Object.keys(this.commentarray).length === 0) {
          this.commentarray = null;
        }
      }
    });
  }
  deleteAnswer(idd, answerId, objId, index) {
    this.getPostService.httpDelete('question/' + objId + '/', answerId).subscribe(Data => {
      if (Data.status === 200) {
        idd.comments -= 1;
        this.answerarray.splice(index, 1);
        if (Object.keys(this.answerarray).length === 0) {
          this.answerarray = null;
        }
      }
    });
  }

  appendToPost(obj) {
    this.Posts.splice(0, 0, obj);
    this.tagsArray.splice(0, 0, obj.tags);
    this.tagSeparated.splice(0, 0, obj.tags.split(';'));
  }

  setvoteButtonWidth = post => {
    this.color = ['#9B59B6', '#3498DB', '#E67E22', 'green'];
    if (post.pollstats != null && post.pollstats.length !== 0) {
      post.width = this.calculatPostWidth(post.pollstats);
      return true;
    } else {
      this.getPostService
        .httpGet(this.requestStringPoll + post._id)
        .subscribe(response => {
          post.width = this.calculatPostWidth(response.body.choices);
          post['isuserpolledafter'] = true;
        });
      return true;
    }
  }
  calculatPostWidth(postTarget) {
    let totalNoOfVoters = 0;
    for (let i = 0; i < postTarget.length; i++) {
      totalNoOfVoters += postTarget[i];
    }
    const options = postTarget;
    const optionsPercentages = options.map(
      option => option / totalNoOfVoters * 100
    );
    return optionsPercentages;
  }

  voteButtonClick = (post, choiceNumber) => {
    this.getPostService
      .httpPost(this.requestStringPoll + post._id, { choiceNumber })
      .subscribe(res => {
        if (res.status === 200) {
          this.setvoteButtonWidth(post);
        }
      });
  }
  checkPollStat(card, status) {
    if (status) {
      return this.setvoteButtonWidth(card);
    } else {
      return false;
    }
  }
  onScroll() {
    this.noOfItemsToShowInitially += this.itemsToLoad;
    this.noOfItemsToSkip += this.itemsToLoad;
    this.requestString =
      'posts?skip=' + this.noOfItemsToSkip + '&limit=' + this.itemsToLoad;
    this.getPostService.httpGet(this.requestString).subscribe(data => {
      if (data.body != null) {
        const fetchedPosts: any = data.body.map(post => {
          post.width = [];
          this.tagsArray.push(post.tags);
          this.tagSeparated.push(post.tags.split(';'));
          return post;
        });
        this.Posts.push.apply(this.Posts, fetchedPosts);
        this.len = this.Posts.length;
      }
    });
  }
  fetchUserName(userId: String) {
    if (userId != null) {
      const userObject = this.userDataService.fetchUserName(userId);
      if (userObject != null) {
        return userObject['value'].userName;
      }
    }
  }
  fetchUserImage(userId: String) {
    if (userId != null) {
      const userObject = this.userDataService.fetchUserImage(userId);
      if (userObject != null) {
        return userObject['value'].userImage;
      }
    }
  }
  fetchTag(tag: String) {
    if (tag != null) {
      return '#' + tag.trim().replace('#', '');
    }
  }
  editorSizeChanger = () => {
    if (this.smallTextEditor === true) {
      this.smallTextEditor = false;
    } else {
      this.smallTextEditor = true;
    }
  }
  commentSizeChanger = () => {
    if (this.smallTextComment === true) {
      this.smallTextComment = false;
    } else {
      this.smallTextComment = true;
    }
  }
  getTags = (content: string[]) => {
    this.Tags = content;
  }
  addTags() {
    if (this.tagsOn === false) {
      this.tagsOn = true;
    } else {
      this.tagsOn = false;
    }
  }
  selectChangeHandler = value => {
    this.selectedPost = value;
  }
  liked(post) {
    const selectedPost = post;
    if (post.isuserliked === false) {
      post.isuserliked = !post.isuserliked;
      post.likes += 1;
      this.getPostService.httpGet('like/' + post._id).subscribe();
    } else {
      post.isuserliked = !post.isuserliked;
      post.likes -= 1;
      this.getPostService.httpGet('like/unlike/' + post._id).subscribe();
    }
  }
  onSelectButton = i => {
    this.data = i;
  }
  comments = id => {
    this.currentselectedid = id._id;
    this.comment = '';
    this.smallTextComment = true;
    if (id.comments !== 0) {
      this.getPostService.httpGet('' + this.requestStringComment + id._id).subscribe(data => {
        this.commentgetarray = data.body;
        this.commentarray = this.commentgetarray.comments;
      });
    }
    this.commentarray = null;
  }
  answers = id => {
    this.currentselectedid = id._id;
    this.answer = '';

    if (id.comments !== 0) {
      this.getPostService.httpGet('' + this.requestStringAnswer + id._id).subscribe(data => {
        this.answerarray = data.body.answers;
      });
    }
    this.answerarray = null;
  }
  questionResponse = id => {
    this.currentselectedid = id;
    this.currentcommentid = id;
    this.answer = '';
  }
  submitResponse(idd) {
    if (this.answer.length !== 0) {
      this.questionResponseFlag = false;
      this.answerButtonFlag = true;
      this.answer = this.answer.replace(this.answer.charAt(0),
        this.answer.charAt(0).toUpperCase());
      this.AnswerObj.answer = this.answer;
      this.AnswerObj.upvotes = 101;
      this.AnswerObj.questionID = idd._id;
      this.getPostService
        .httpPost(this.requestStringAnswer, this.AnswerObj)
        .subscribe(res => {
          if (res.status === 200) {
            this.getPostService
              .httpGet(this.requestStringAnswer + idd._id)
              .subscribe(data => {
                if (data.status === 200) {
                  this.answerarray = data.body.answers;
                  idd.comments += 1;
                  this.toast.success('Answer uploaded');
                  this.answer = '';
                } else {
                  this.toast.error('Error Uploading Answer');
                }
              });
          }
        });
    } else {
      this.toast.error('Enter an Answer');
    }
    this.smallTextComment = true;
  }
  voted(postId, voteCard, vote: String) {
    const voteObject = {} as VoteModel;
    voteObject.postId = postId;
    voteObject.voteId = voteCard._id;
    voteObject.voteType = vote;
    this.getPostService.httpPost(this.requestStringAnswer + 'vote', voteObject).subscribe((res) => {
      if (res.status === 200) {
        voteCard.downvotes += res.body.downFlag;
        voteCard.upvotes += res.body.upFlag;
        if (vote === 'down') {
          voteCard.downvoted = true;
          voteCard.upvoted = false;
          this.toast.success('Downvoted Successfully');
        } else {
          voteCard.downvoted = false;
          voteCard.upvoted = true;
          this.toast.success('Upvoted Successfully');
        }
      } else { this.toast.error('Vote Not Submitted'); }
    });
  }
  submitComment = idd => {
    if (this.comment.length !== 0) {
      this.commentObject.postId = idd._id;
      this.comment = this.comment.replace(this.comment.charAt(0),
        this.comment.charAt(0).toUpperCase());
      this.commentObject.comment = this.comment;
      this.getPostService
        .httpPost(this.requestStringComment, this.commentObject)
        .subscribe(res => {
          if (res.status === 200) {
            this.getPostService
              .httpGet('' + this.requestStringComment + idd._id)
              .subscribe(data => {
                if (data.status === 200) {
                  this.commentgetarray = data.body;
                  this.commentarray = this.commentgetarray.comments;
                  idd.comments += 1;
                }
              });
          }
        });
      this.toast.success(COMMENT_UPLOADED);
      this.comment = '';
    } else {
      this.toast.error(ENTER_COMMENT);
    }
    this.smallTextComment = true;
  }
  cancelComment = () => {
    this.comment = '';
    this.smallTextComment = true;
    this.answer = '';
  }
  close = () => {
    this.currentcommentid = null;
    this.currentselectedid = null;
    this.smallTextComment = true;
    this.answer = '';
    this.comment = '';
  }
  answerselected(id, idd, card) {
    // this.bestAnswerSelectedFlag = true;
    this.Object.bestAnswer = id;
    this.currentcommentid = idd;
    this.getPostService
      .httpPost(
        this.requestStringPost +
        this.currentcommentid +
        '/' +
        this.Object.bestAnswer
      )
      .subscribe(res => {
        if (res.status === 200) {
          card.bestAnswer = id;
        }
      });
    this.smallTextComment = true;
  }
  dateFromObjectId = objectId => {
    if (objectId != null) {
      this.date = new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
      return this.date;
    }
  }
}
@Pipe({ name: 'keys' })
export class KeyPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const keys = [];
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        keys.push({ value: value[key] });
      }
    }
    return keys;
  }
}
