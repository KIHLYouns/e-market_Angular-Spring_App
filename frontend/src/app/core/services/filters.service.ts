import { Injectable } from '@angular/core';
import { ItemFilters } from '../../shared/models/item.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private _filters = new BehaviorSubject<ItemFilters>({
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    condition: [],
    searchQuery: '',
    location: '',
    sort: '',
  });

  filters$ = this._filters.asObservable();

  getFilters(): ItemFilters {
    return this._filters.getValue();
  }

  setFilters(newFilters: ItemFilters): void {
    this._filters.next({ ...newFilters });
  }
}
