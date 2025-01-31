import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'listing',
    loadChildren: () => import('./listing/listing.module').then((m) => m.ListingModule),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
