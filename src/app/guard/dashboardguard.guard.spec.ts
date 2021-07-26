import { TestBed } from '@angular/core/testing';

import { DashboardguardGuard } from './dashboardguard.guard';

describe('DashboardguardGuard', () => {
  let guard: DashboardguardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DashboardguardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
