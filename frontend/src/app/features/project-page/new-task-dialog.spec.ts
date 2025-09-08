import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { NewTaskDialog } from './new-task-dialog';

describe('NewTaskDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTaskDialog]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NewTaskDialog);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
