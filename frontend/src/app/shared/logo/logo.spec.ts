import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Logo } from './logo';

describe('Logo', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Logo]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Logo);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
