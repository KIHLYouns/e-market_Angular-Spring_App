import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {HomePageComponent} from "./containers/home-page/home-page.component";
import {ListingPageComponent} from "./containers/listing-page/listing-page.component";

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'listing/:id', component: ListingPageComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class HomeModule {
}
