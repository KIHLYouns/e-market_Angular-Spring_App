import { Injectable } from '@angular/core';
import { Item, ItemFilters } from '../../shared/models/item.interface';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private mockItems: Item[] = [
    {
      id: 1,
      title: 'MacBook Pro 16" M2 Pro (2023)',
      price: 1999,
      images: [
        'assets/images/item-placeholder.jpg',
        'assets/images/item-placeholder.jpg',
        'assets/images/item-placeholder.jpg',
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
        'assets/images/item-placeholder.jpg',
        'assets/images/item-placeholder.jpg',
        'assets/images/item-placeholder.jpg',
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
        'assets/images/item-placeholder.jpg',
        'assets/images/item-placeholder.jpg',
        'assets/images/item-placeholder.jpg',
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
        'assets/images/item-placeholder.jpg',
        'assets/images/item-placeholder.jpg',
        'assets/images/item-placeholder.jpg',
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

  getItemById(id: number): Item {
    const item = this.mockItems.find((p) => p.id === id);
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  }

  getCategories(): string[] {
    return this.categories;
  }

  getItems(filters?: ItemFilters): Item[] {
    let filteredItems = [...this.mockItems];

    if (filters) {
      if (filters.category && filters.category !== 'All Items') {
        filteredItems = filteredItems.filter(
          (p) => p.category === filters.category
        );
      }

      if (filters.minPrice) {
        filteredItems = filteredItems.filter(
          (p) => p.price >= filters.minPrice!
        );
      }

      if (filters.maxPrice) {
        filteredItems = filteredItems.filter(
          (p) => p.price <= filters.maxPrice!
        );
      }

      if (filters.condition && filters.condition.length > 0) {
        filteredItems = filteredItems.filter((p) =>
          filters.condition!.includes(p.condition)
        );
      }

      if (filters.searchQuery && filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        filteredItems = filteredItems.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
      }
      if (filters.location) {
        filteredItems = filteredItems.filter(
          (p) => p.location === filters.location
        );
      }
    }

    return filteredItems;
  }
}
