import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { PriorityTag } from './priority-tag';

describe('PriorityTag', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorityTag]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PriorityTag);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
