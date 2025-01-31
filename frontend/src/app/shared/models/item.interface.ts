export interface Item {
  id: number;
  title: string;
  price: number;
  images: string[];
  location: string;
  description: string;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  seller: Seller;
}

export interface Seller {
  name: string;
  rating: number;
  reviewCount: number;
  avatarUrl: string;
}

export interface ItemFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
  searchQuery?: string;
  location?: string;
}
