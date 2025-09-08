import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthLayout } from './auth-layout';

describe('AuthLayout', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLayout]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AuthLayout);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
