import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Dashboard } from './layouts/dashboard/dashboard';
import { Auth } from './layouts/auth/auth';
import { Home } from './pages/home/home';
import { ProductComponent } from './pages/product/product';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: Auth,
    children: [
      { path: 'login', component: Login },
      { path: 'signup', component: Signup },
    ],
  },
  {
    path: '',
    component: Dashboard,
    children: [
      { path: 'home', component: Home },
      { path: 'product/:id',  loadComponent: () => import('./pages/product/product').then(p => p.ProductComponent) },
    ],
  },
  { path: '**', redirectTo: 'login' },
];