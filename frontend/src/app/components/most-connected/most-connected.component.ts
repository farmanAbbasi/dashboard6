import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MostConnectedService } from '../../services/most-connected.service';
import { People } from './most-connected.interface';

@Component({
  selector: 'app-most-connected',
  templateUrl: './most-connected.component.html',
  styleUrls: ['./most-connected.component.scss']
})
export class MostConnectedComponent implements OnInit {
  title = 'most connected';
  people: People[];

  constructor(private p: MostConnectedService) {}

  ngOnInit() {
    this.p.getPeople().subscribe(person => (this.people = person));
  }
}
