import { Routes } from '@angular/router';
import { Dashboard } from './layouts/dashboard/dashboard';
import { Auth } from './layouts/auth/auth';
import { authGuard } from './core/guard/auth.guard';
import { guestGuard } from './core/guard/guest.guard';
import { adminGuard } from './core/guard/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: Auth,
    canActivateChild: [guestGuard],
    children: [
      { path: 'login', loadComponent: () => import('./pages/login/login').then(c => c.Login) },
      { path: 'signup', loadComponent: () => import('./pages/signup/signup').then(c => c.Signup) },
    ],
  },
  {
    path: '',
    component: Dashboard,
    canActivateChild: [authGuard],
    children: [
      { path: 'home', loadComponent: () => import('./pages/home/home').then(c => c.Home) },
      { path: 'product/:id', loadComponent: () => import('./pages/product/product').then(p => p.ProductComponent) },
      { path: 'categories', loadComponent: () => import('./pages/categories/categories').then(p => p.Categories), canActivate: [adminGuard] },
    ],
  },
  { path: '**', redirectTo: 'home' },
];