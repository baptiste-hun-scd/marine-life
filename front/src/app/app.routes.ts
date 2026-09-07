import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./research/research.component').then((m) => m.Research),
  },
  {
    path: 'species/:id',
    loadComponent: () =>
      import('./species/species-detail/species-detail.component').then((m) => m.SpeciesDetail),
  },
];
