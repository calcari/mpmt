import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { InviteDialog } from './invite-dialog';

describe('InviteDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteDialog]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(InviteDialog);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
