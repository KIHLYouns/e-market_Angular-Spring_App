import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostListingComponent } from './containers/post-listing/post-listing.component';

const routes: Routes = [
  { path: 'post', component: PostListingComponent }
];

@NgModule({
  declarations: [
    PostListingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ListingModule { }
