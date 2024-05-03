import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component'),
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup.component'),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'profile',
  },
];
