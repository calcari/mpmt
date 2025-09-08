import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Login } from './login';

describe('Login', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
