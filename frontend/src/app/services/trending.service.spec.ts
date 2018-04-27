import { TestBed, inject } from '@angular/core/testing';

import { TrendingService } from './trending.service';

describe('TrendingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrendingService]
    });
  });

  it('should be created', inject([TrendingService], (service: TrendingService) => {
    expect(service).toBeTruthy();
  }));
});
