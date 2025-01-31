import { Injectable } from '@angular/core';
import { Product, ProductFilters } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private mockProducts: Product[] = [
    {
      id: 1,
      title: 'MacBook Pro 16" M2 Pro (2023)',
      price: 1999,
      images: [
        'assets/images/product-placeholder.jpg',
        'assets/images/product-placeholder.jpg',
        'assets/images/product-placeholder.jpg',
      ],
      location: 'Tetouan',
      description:
        'Selling my MacBook Pro 16" with M2 Pro chip. Purchased in early 2023, barely used and in perfect condition.',
      category: 'Electronics',
      condition: 'Like New',
      seller: {
        name: 'John Smith',
        rating: 4.9,
        reviewCount: 212,
        avatarUrl: 'assets/images/default-avatar.jpeg',
      },
    },
    {
      id: 2,
      title: 'Sony WH-1000XM5 Wireless Headphones',
      price: 349,
      images: [
        'assets/images/product-placeholder.jpg',
        'assets/images/product-placeholder.jpg',
        'assets/images/product-placeholder.jpg',
      ],
      location: 'Tangier',
      description:
        'Latest model of Sony noise-canceling headphones. Used for a couple of months, still in excellent condition.',
      category: 'Electronics',
      condition: 'New',
      seller: {
        name: 'Jane Doe',
        rating: 4.8,
        reviewCount: 158,
        avatarUrl: 'assets/images/default-avatar.jpeg',
      },
    },
    {
      id: 3,
      title: 'Nintendo Switch OLED (2022)',
      price: 299,
      images: [
        'assets/images/product-placeholder.jpg',
        'assets/images/product-placeholder.jpg',
        'assets/images/product-placeholder.jpg',
      ],
      location: 'Casablanca',
      description:
        'Nintendo Switch OLED model with a few games included. Perfect working condition, minor cosmetic scratches.',
      category: 'Electronics',
      condition: 'Good',
      seller: {
        name: 'Michael Green',
        rating: 4.7,
        reviewCount: 85,
        avatarUrl: 'assets/images/default-avatar.jpeg',
      },
    },
    {
      id: 4,
      title: 'Dell XPS 13 (2023)',
      price: 1299,
      images: [
        'assets/images/product-placeholder.jpg',
        'assets/images/product-placeholder.jpg',
        'assets/images/product-placeholder.jpg',
      ],
      location: 'Marrakech',
      description:
        'Lightly used Dell XPS 13 laptop, latest 2023 model. Comes with original box and accessories.',
      category: 'Electronics',
      condition: 'Fair',
      seller: {
        name: 'Linda Brown',
        rating: 4.6,
        reviewCount: 64,
        avatarUrl: 'assets/images/default-avatar.jpeg',
      },
    },
  ];
  private categories: string[] = [
    'All Items',
    'Vehicles',
    'Electronics',
    'Furniture',
    'Fashion',
    'Real Estate',
    'Sports',
    'Games',
  ];

  constructor() {}

  getProductById(id: number): Product {
    const product = this.mockProducts.find((p) => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  getCategories(): string[] {
    return this.categories;
  }

  getProducts(filters?: ProductFilters): Product[] {
    let filteredProducts = [...this.mockProducts];

    if (filters) {
      if (filters.category && filters.category !== 'All Items') {
        filteredProducts = filteredProducts.filter(
          (p) => p.category === filters.category
        );
      }

      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter(
          (p) => p.price >= filters.minPrice!
        );
      }

      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(
          (p) => p.price <= filters.maxPrice!
        );
      }

      if (filters.condition && filters.condition.length > 0) {
        filteredProducts = filteredProducts.filter((p) =>
          filters.condition!.includes(p.condition)
        );
      }

      if (filters.searchQuery && filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        filteredProducts = filteredProducts.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
      }
      if (filters.location) {
        filteredProducts = filteredProducts.filter(
          (p) => p.location === filters.location
        );
      }
    }

    return filteredProducts;
  }
}
