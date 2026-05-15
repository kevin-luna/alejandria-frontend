import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'buscar',
    pathMatch: 'full',
  },
  {
    path: 'buscar',
    loadComponent: () =>
      import('./pages/search/search-by-id.component').then(
        (m) => m.SearchByIdComponent
      ),
  },
  {
    path: 'registrar',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'buscar',
  },
];
