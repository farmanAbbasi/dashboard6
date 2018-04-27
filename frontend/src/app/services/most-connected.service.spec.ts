import { TestBed, inject } from '@angular/core/testing';

import { MostConnectedService } from './most-connected.service';

describe('MostConnectedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MostConnectedService]
    });
  });

  it('should be created', inject([MostConnectedService], (service: MostConnectedService) => {
    expect(service).toBeTruthy();
  }));
});
