import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/principal.component').then(m => m.default),
    children: [
      {
        path: 'login',
        title: 'Maskota: Login - 2025',
        loadComponent: () => import('./auth/login/login.component').then(m => m.default),
      },
      {
        path: 'registro',
        title: 'Maskota: Registro - 2025',
        loadComponent: () => import('./auth/registro/registro.component').then(m => m.default),
      },
      {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },

  
  
  
  
  
  {
    path: 'maskota',
    loadComponent: () => import('./eccs/eccs.component').then(m => m.default),
    children: [
      {
        path: 'principal',
        loadComponent: () => import('./eccs/principal/principal.component').then(m => m.default)
      },
      {
        path: '',
        redirectTo: 'principal',
        pathMatch: 'full'
      }
    ]
  }




];
