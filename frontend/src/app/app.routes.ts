import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { guestGuard } from './shared/guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'logout', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'auth/registration',
    loadComponent: () =>
      import('./features/auth/registration/registration.component').then((m) => m.RegistrationComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'rooms',
    loadComponent: () => import('./features/rooms/components/rooms/rooms.component').then((m) => m.RoomsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'not-found',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/components/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/components/products/products.component').then((m) => m.ProductsComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
