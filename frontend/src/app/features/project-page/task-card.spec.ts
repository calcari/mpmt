import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TaskCard } from './task-card';

describe('TaskCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCard]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TaskCard);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
