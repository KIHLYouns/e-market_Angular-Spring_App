import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../home/services/products.service';
import { Product } from '../../../home/models/product.interface';

@Component({
  selector: 'app-listing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listing-details-page.component.html',
  styleUrls: ['./listing-details-page.component.css'],
})
export class ListingDetailsPageComponent implements OnInit {
  product!: Product;
  isSaved: boolean = false;
  currentImage: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.fetchProductDetails(id);
    });
  }

  private fetchProductDetails(id: number): void {
    this.product = this.productsService.getProductById(id);
  }

  toggleSave(): void {
    this.isSaved = !this.isSaved;
  }

  prevImage(): void {
    this.currentImage =
      (this.currentImage - 1 + this.product.images.length) %
      this.product.images.length;
  }

  nextImage(): void {
    this.currentImage = (this.currentImage + 1) % this.product.images.length;
  }

  selectImage(index: number): void {
    this.currentImage = index;
  }
}
