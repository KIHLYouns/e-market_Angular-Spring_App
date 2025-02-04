import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'listing',
    loadChildren: () => import('./features/listing/listing.routes').then((m) => m.LISTING_ROUTES),
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
  },
  {
    path: 'messages',
    loadChildren: () => import('./features/messages/messages.routes').then((m) => m.MESSAGES_ROUTES),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
