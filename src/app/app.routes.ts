import { Routes } from '@angular/router';

export const routes: Routes = [
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
  },
  {
    path: '',
    redirectTo: 'maskota/principal',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'maskota/principal',
    pathMatch: 'full',
  },
];
