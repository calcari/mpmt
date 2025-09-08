import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { RoleTag } from './role-tag';

describe('RoleTag', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleTag]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RoleTag);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
