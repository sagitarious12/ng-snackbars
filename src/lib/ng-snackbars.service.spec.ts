import { TestBed, inject } from '@angular/core/testing';

import { NgSnackbarsService } from './ng-snackbars.service';

describe('NgSnackbarsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgSnackbarsService]
    });
  });

  it('should be created', inject([NgSnackbarsService], (service: NgSnackbarsService) => {
    expect(service).toBeTruthy();
  }));
});
