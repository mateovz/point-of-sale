import { TestBed } from '@angular/core/testing';

import { AuthServiceInterceptor } from './auth.service';

describe('AuthService', () => {
  let service: AuthServiceInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthServiceInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
