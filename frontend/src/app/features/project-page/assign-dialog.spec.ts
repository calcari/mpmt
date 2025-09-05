import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AssignDialog } from './assign-dialog';

describe('AssignDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignDialog]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AssignDialog);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
