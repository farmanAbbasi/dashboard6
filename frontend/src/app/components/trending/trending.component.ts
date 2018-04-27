import { Component, OnInit } from '@angular/core';
import { Trend } from './trending.interface';
import { Observable } from 'rxjs/Observable';
import { TrendingService } from '../../services/trending.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit {
  trends: Trend[];

  constructor(private trendsdata: TrendingService) {}

  // Getting trends from TrendsdataService
  ngOnInit() {
    this.trendsdata.getTrends().subscribe(trends => (this.trends = trends));
  }
}
