import {Component, Input} from '@angular/core';
import {Product} from "../../models/product";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css', '../../containers/home-page/home-page.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
}
