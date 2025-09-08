import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TaskDetailDialog } from './task-detail-dialog';

describe('TaskDetailDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailDialog]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TaskDetailDialog);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
