import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AssigneeChipComponent } from './user-chip';

describe('AssigneeChipComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssigneeChipComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AssigneeChipComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
