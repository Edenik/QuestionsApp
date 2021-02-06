import { TestBed } from '@angular/core/testing';

import { CelebrateService } from './celebrate.service';

describe('CelebrateService', () => {
  let service: CelebrateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CelebrateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
