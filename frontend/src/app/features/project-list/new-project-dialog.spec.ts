import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { NewProjectDialog } from './new-project-dialog';

describe('NewProjectDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProjectDialog]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NewProjectDialog);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
