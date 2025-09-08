import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Drawer } from './drawer';

describe('Drawer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Drawer]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Drawer);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
