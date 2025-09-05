import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './features/home/home';
import { ProjectList } from './features/project-list/project-list';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { Login } from './features/login/login';
import { Register } from './features/register/register';
import { authGuard } from '@core/auth/auth-guard';
import { ErrorPage } from '@features/error-page/error-page';
import { ProjectPage } from '@features/project-page/project-page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'projects', component: ProjectList },
      { path: 'projects/:projectId', component: ProjectPage },
    ],
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },
  {
    path: 'error',
    component: ErrorPage,
  },
];
