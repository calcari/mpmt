import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { StatusTag } from './status-tag';

describe('StatusTag', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusTag]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StatusTag);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});