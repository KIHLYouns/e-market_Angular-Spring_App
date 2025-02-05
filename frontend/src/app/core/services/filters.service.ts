import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemFilters } from '../../shared/models/item.interface';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private readonly FILTERS_STORAGE_KEY = 'marketplace_filters';
  private filtersSubject = new BehaviorSubject<ItemFilters>(this.getInitialFilters());

  filters$ = this.filtersSubject.asObservable();

  private getInitialFilters(): ItemFilters {
    const stored = localStorage.getItem(this.FILTERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      condition: [],
      searchQuery: '',
      location: '',
      sort: ''
    };
  }

  getFilters(): ItemFilters {
    return this.filtersSubject.value;
  }

  setFilters(filters: ItemFilters): void {
    localStorage.setItem(this.FILTERS_STORAGE_KEY, JSON.stringify(filters));
    this.filtersSubject.next(filters);
  }

  clearFilters(): void {
    const initialFilters = {
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      condition: [],
      sort: ''
    };
    this.setFilters(initialFilters);
  }
}