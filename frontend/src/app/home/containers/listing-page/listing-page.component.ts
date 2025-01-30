import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Product} from "../../models/product";
import {ActivatedRoute} from "@angular/router";
import {ProductsService} from "../../services/products.service";

@Component({
  selector: 'app-listing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listing-page.component.html',
  styleUrls: ['./listing-page.component.css']
})
export class ListingPageComponent implements OnInit {
  product!: Product;
  isSaved: boolean = false;
  currentImage: number = 0;

  constructor(private route: ActivatedRoute,
              private productsService: ProductsService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.fetchProductDetails(id);
    })
  }

  private fetchProductDetails(id: number): void {
    this.product = this.productsService.getProductById(id);
  }

  toggleSave(): void {
    this.isSaved = !this.isSaved;
  }

  prevImage(): void {
    this.currentImage = (this.currentImage - 1 + this.product.images.length) % this.product.images.length;
  }

  nextImage(): void {
    this.currentImage = (this.currentImage + 1) % this.product.images.length;
  }

  selectImage(index: number): void {
    this.currentImage = index;
  }
}
