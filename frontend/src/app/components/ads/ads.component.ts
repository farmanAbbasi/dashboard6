import { Component, OnInit } from '@angular/core';
import { AdsContent } from '../ads/ads.model';
import { MatCardModule } from '@angular/material/card';
import { AdsService } from '../../services/ads.service';
import { Priority } from './priority';
import { map } from 'rxjs/operators';
import { windowTime } from 'rxjs/operators/windowTime';
import { Observable } from 'rxjs/Observable';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';


@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {

  adsContent: AdsContent[] = [];
  i = 0;
  imgSrc: String;

  // highAds: Array<string>;
  // medAds: Array<string>;
  // lowAds: Array<string>;

  constructor(private adsservice: AdsService) {

  }

  ngOnInit() {
    this.adsservice.fetchPost().subscribe(val => this.adsContent = val);
    IntervalObservable.create(3000)
      .subscribe(() => {
        this.getSlide();
      });
  }

  getSlide() {
    this.i = (this.i + 1) % this.adsContent.length;
    this.imgSrc = this.adsContent[this.i].imageurl;
  }

}
