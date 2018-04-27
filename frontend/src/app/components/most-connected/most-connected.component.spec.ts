import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostConnectedComponent } from './most-connected.component';

describe('MostConnectedComponent', () => {
  let component: MostConnectedComponent;
  let fixture: ComponentFixture<MostConnectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostConnectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostConnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
