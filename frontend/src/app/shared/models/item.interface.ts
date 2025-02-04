import { User } from './user.interface';

export interface Item {
  id: number;
  title: string;
  price: number;
  images: string[];
  location: string;
  description: string;
  category: string;
  condition: string;
  status: string;
  createdAt: string;
  views: number;
  sellerId: number;
  savedBy: number[];
  seller?: User;
}

export interface ItemFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
  searchQuery?: string;
  location?: string;
  sort?: string;
}
