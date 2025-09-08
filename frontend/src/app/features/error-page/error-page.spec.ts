import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ErrorPage } from './error-page';

describe('ErrorPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorPage]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ErrorPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
