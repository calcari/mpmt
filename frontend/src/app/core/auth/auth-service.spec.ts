import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from './auth-service';

describe('Auth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const service = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });

  it('should return login state', () => {
    const service = TestBed.inject(AuthService);
    // Test sans utilisateur
    expect(service.isLoggedIn).toBe(false);
    expect(service.userId).toBe(null);

    // Test avec utilisateur
    const mockUser = { id: 123, email: 'test@test.com' };
    //@ts-ignore
    service.setUser(mockUser);
    expect(service.isLoggedIn).toBe(true);
    expect(service.userId).toBe(123);
  });
})
