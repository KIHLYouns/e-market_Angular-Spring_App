import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Profile } from '../models/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  getUserReviews(id: string) {
    throw new Error('Method not implemented.');
  }
  private mockProfile: Profile = {
    id: '1',
    username: 'kihl_youns',
    email: 'kihl.youns@example.com',
    fullName: 'Kihl Youns',
    avatar: 'assets/images/default-avatar.jpeg',
    bio: 'Passionate about buying and selling unique items. Always looking for great deals!',
    location: 'Paris, France',
    joinDate: new Date('2025-01-01'),
    listings: {
      active: 2,
      sold: 1
    },
    ratings: {
      average: 4.8,
      count: 5
    }
  };

  private mockListings = [
    {
      id: '1',
      title: 'MacBook Pro M2',
      price: 1299.99,
      imageUrl: 'assets/images/products/macbook.jpg',
      status: 'active',
      description: 'MacBook Pro M2 2023, 16GB RAM, 512GB SSD, Space Gray',
      category: 'Electronics'
    },
    {
      id: '2',
      title: 'iPhone 15 Pro',
      price: 999.99,
      imageUrl: 'assets/images/products/iphone.jpg',
      status: 'active',
      description: 'iPhone 15 Pro, 256GB, Titanium finish, unlocked',
      category: 'Electronics'
    },
    {
      id: '3',
      title: 'AirPods Pro',
      price: 199.99,
      imageUrl: 'assets/images/products/airpods.jpg',
      status: 'sold',
      description: '2nd generation AirPods Pro with noise cancellation',
      category: 'Electronics'
    }
  ];

  private mockSavedItems = [
    {
      id: '4',
      title: 'iPad Air',
      price: 599.99,
      imageUrl: 'assets/images/products/ipad.jpg',
      seller: 'Tech Store',
      description: 'iPad Air 5th generation, 64GB, WiFi',
      category: 'Electronics'
    },
    {
      id: '5',
      title: 'Apple Watch Series 8',
      price: 399.99,
      imageUrl: 'assets/images/products/watch.jpg',
      seller: 'iWorld',
      description: 'Apple Watch Series 8, 45mm, GPS',
      category: 'Electronics'
    }
  ];

  private profileSubject = new BehaviorSubject<Profile | null>(this.mockProfile);
  profile$ = this.profileSubject.asObservable();

  constructor() {}

  getCurrentProfile(): Observable<Profile> {
    return of(this.mockProfile);
  }

  updateProfile(profileData: Partial<Profile>): Observable<Profile> {
    this.mockProfile = {
      ...this.mockProfile,
      ...profileData
    };
    this.profileSubject.next(this.mockProfile);
    return of(this.mockProfile);
  }

  updateAvatar(file: File): Observable<{ avatarUrl: string }> {
    const mockResponse = { 
      avatarUrl: `assets/images/profile/${file.name}` 
    };
    return of(mockResponse);
  }

  getSavedItems(): Observable<any[]> {
    return of(this.mockSavedItems);
  }

  getListings(): Observable<any[]> {
    return of(this.mockListings);
  }
}