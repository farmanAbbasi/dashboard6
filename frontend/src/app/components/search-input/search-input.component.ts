import {
  Component,
  OnInit,
  EventEmitter,
  ElementRef,
  Output,
  ViewChild
} from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { Content } from '../forum/common.model';
import { DatePipe } from '@angular/common';
import { UserdataService } from '../../services/userdata.service';
@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {
  @ViewChild('input') input: ElementRef;
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  results: Content[] = [];
  date: Date = new Date();
  isInputShown = false;
  searchValue = '';
  hint = 'Hit enter to search';
  requestString = 'search';
  queryObject = {
    query: String
  };
  constructor(
    private http: GlobalService,
    public datepipe: DatePipe,
    private userDataService: UserdataService
  ) {}

  ngOnInit() {}
  showInput() {
    this.isInputShown = true;
    this.input.nativeElement.focus();
  }
  hideInput() {
    this.isInputShown = false;
  }

  onInput(val: string) {
    this.search.emit(val);
  }

  toggleSearch() {

    const searchInput = document.querySelector('#search-input');
    const appRoot = document.querySelector('#app-root');
    if (searchInput instanceof HTMLElement) {
      searchInput.classList.remove('show');
      searchInput.classList.remove('searching');
      this.searchValue = '';
      this.results = [];
      if (appRoot instanceof HTMLElement) {
        appRoot.className = '';
      } else {
        throw new Error('element #app-root not in document');
      }
    } else {
      throw new Error('element #search-input not in document');
    }
  }
  submitSearch(query) {
    const searchInput = document.querySelector('#search-input');
    this.queryObject.query = query;
    if (searchInput instanceof HTMLElement) {
      searchInput.classList.add('searching');
      this.http
        .httpPost(this.requestString, this.queryObject)
        .subscribe(response => {
          this.results = [];
          // tslint:disable-next-line:forin
          for (const key in response.body.posts) {
            const obj = response.body.posts[key];
            this.results.push(obj);
          }
        });
    }
  }

  fetchUserName(userId: String) {
    const userObject = this.userDataService.fetchUserName(userId);
    if (userObject != null) {
      return userObject['value'].userName;
    }
  }
  fetchUserImage(userId: String) {
    const userObject = this.userDataService.fetchUserImage(userId);
    if (userObject != null) {
      return userObject['value'].userImage;
    }
  }
  dateFromObjectId(objectId) {
    this.date = new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    return this.date;
  }
  diff_minutes(dt2, dt1) {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    const min = Math.abs(Math.round(diff));
    if (min > 59) {
      const hr = min / 60;
      if (hr > 23) {
        const day = hr / 24;
        return (day === 1 ?  '1 day ago' : Math.abs(Math.round(day)) + ' days ago');
      }
      return (hr === 1 ?  '1 hour ago' : Math.abs(Math.round(hr)) + ' hours ago');
    }
    return (min === 0 ?  'Just now' : (min === 1 ?  '1 min ago' : Math.abs(Math.round(min)) + ' mins ago'));
  }
    dateFinder(date) {
      const currentTime = new Date();
      return this.diff_minutes(currentTime, date);
    }
}
