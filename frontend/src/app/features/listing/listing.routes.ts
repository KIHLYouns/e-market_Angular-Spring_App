import { Routes } from '@angular/router';
import { PostListingPageComponent } from './pages/post-listing-page/post-listing-page.component';
import { ListingDetailsPageComponent } from './pages/listing-details-page/listing-details-page.component';

export const LISTING_ROUTES: Routes = [
  { path: 'post', component: PostListingPageComponent },
  { path: ':id', component: ListingDetailsPageComponent },
];
