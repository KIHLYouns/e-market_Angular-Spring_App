import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { Product, ProductFilters } from '../../models/product.interface';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];

  filters: ProductFilters = {
    category: 'All Items',
    minPrice: undefined,
    maxPrice: undefined,
    condition: [],
    searchQuery: '',
    location: '',
  };

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.categories = this.productsService.getCategories();

    // Subscribe to query params for search
    this.route.queryParams.subscribe((params) => {
      if (params['search']) {
        this.filters.searchQuery = params['search'];
      } else {
        this.filters.searchQuery = '';
      }
      if (params['location']) {
        this.filters.location = params['location'];
      } else {
        this.filters.location = '';
      }
      this.products = this.productsService.getProducts(this.filters);
    });
  }

  private applyFilters() {
    this.products = this.productsService.getProducts(this.filters);
  }

  onCategoryChange(category: string) {
    this.filters.category = category;
    this.applyFilters();
  }

  onPriceChange() {
    this.applyFilters();
  }

  onConditionChange(condition: string, checked: boolean) {
    if (checked) {
      this.filters.condition?.push(condition);
    } else {
      this.filters.condition = this.filters.condition?.filter(
        (c) => c !== condition
      );
    }
    this.applyFilters();
  }

  onSearch(query: string) {
    this.filters.searchQuery = query;
    this.applyFilters();
  }
}
