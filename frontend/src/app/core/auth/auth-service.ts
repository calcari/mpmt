import { inject, Injectable, signal } from '@angular/core';
import { paths } from '../api/schema';
import { Router } from '@angular/router';
import { apiClient, injectOpenapiQuery } from '@core/api/client';
import { ProjectMembershipCoreDTO, ProjectRole } from '@core/api/types';

type AuthUser = paths['/api/auth/login']['post']['responses']['200']['content']['*/*'];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readStorage() {
    const user$ = localStorage.getItem(this.STORAGE_KEY);
    if (!user$) return null;

    try {
      return JSON.parse(user$);
    } catch {
      return null;
    }
  }

  public hydrated = false;
  public hydrate() {
    const data = this.readStorage();
    this.state.set(data);
    this.hydrated = true;
    return data;
  }

  private state = signal<AuthUser | null>(
    (() => {
      this.hydrated = true;
      return this.readStorage();
    })()
  );

  private router = inject(Router);

  public get isLoggedIn() {
    return !!this.state();
  }

  public get user() {
    return this.state();
  }

  public get userId() {
    return this.user?.id ?? null;
  }

  public async login({ email, password }: { email: string; password: string }) {
    const { data, response, error } = await apiClient.POST('/api/auth/login', {
      body: {
        email,
        password,
      },
      credentials: 'include', //Allow Set-Cookie header
    });

    if (error || !response.ok) {
      return { error, status: response.status };
    }

    this.setUser(data);
    this.router.navigate([''], { replaceUrl: true });

    return { user: data };
  }

  public async register({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) {
    const { data, response, error } = await apiClient.POST('/api/auth/register', {
      body: {
        username,
        email,
        password,
      },
      credentials: 'include', //Allow Set-Cookie header
    });

    if (error || !response.ok) {
      return { error, status: response.status };
    }

    this.setUser(data);
    this.router.navigate([''], { replaceUrl: true });

    return { user: data };
  }

  private STORAGE_KEY = 'auth';
  private setUser(user: AuthUser | null) {
    if (user) {
      this.state.set(user);
      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } else {
      this.state.set(null);
      window.localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  public logout() {
    this.setUser(null);
    this.router.navigate(['login'], { replaceUrl: true });

    //supprime le cookie
    // document.cookie = `X-User-Id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  public checkAllowed(currentRole: ProjectRole | null | undefined, ...allowedRoles: ProjectRole[]) {
    if(!currentRole)return false;
    return allowedRoles.includes(currentRole);
  }
}
