import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Item, ItemFilters } from '../../shared/models/item.interface';
import { User } from '../../shared/models/user.interface';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environment/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private itemsUrl = `${environment.apiUrl}/items`;
  private categoriesUrl = `${environment.apiUrl}/categories`;
  private locationsUrl = `${environment.apiUrl}/locations`;
  private usersUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves an item by its ID along with seller details.
   * @param id - The ID of the item.
   * @returns Observable<Item>
   */
  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.itemsUrl}/${id}`).pipe(
      switchMap((item) => {
        return this.http.get<User>(`${this.usersUrl}/${item.sellerId}`).pipe(
          map((seller) => {
            return { ...item, seller };
          })
        );
      })
    );
  }

  /**
   * Retrieves all categories.
   * @returns Observable<string[]>
   */
  getCategories(): Observable<string[]> {
    return this.http
      .get<any[]>(this.categoriesUrl)
      .pipe(map((categories) => categories.map((cat) => cat.name)));
  }

  /**
   * Retrieves all locations.
   * @returns Observable<string[]>
   */
  getLocations(): Observable<string[]> {
    return this.http
      .get<any[]>(this.locationsUrl)
      .pipe(map((locations) => locations.map((loc) => loc.city)));
  }

  /**
   * Retrieves items based on provided filters.
   * @param filters - The filters to apply.
   * @returns Observable<Item[]>
   */
  getItems(filters?: ItemFilters): Observable<Item[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.category) {
        params = params.set('category', filters.category);
      }

      if (filters.minPrice != null) {
        params = params.set('price_gte', filters.minPrice.toString());
      }

      if (filters.maxPrice != null) {
        params = params.set('price_lte', filters.maxPrice.toString());
      }

      if (filters.condition && filters.condition.length > 0) {
        filters.condition.forEach((cond) => {
          params = params.append('condition', cond);
        });
      }

      if (filters.searchQuery !=null) {
        params = params.set('q', filters.searchQuery.trim());
      }

      if (filters.location) {
        params = params.set('location', filters.location);
      }

      if (filters.sort) {
        switch (filters.sort) {
          case 'latest':
        params = params.set('_sort', 'createdAt').set('_order', 'desc');
        break;
          case 'price_low':
        params = params.set('_sort', 'price').set('_order', 'asc');
        break;
          case 'price_high':
        params = params.set('_sort', 'price').set('_order', 'desc');
        break;
        }
      }
    }
    return this.http.get<Item[]>(this.itemsUrl, { params });
  }

  /**
   * Adds a new item.
   * @param item - The item to add.
   * @returns Observable<Item>
   */
  addItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.itemsUrl, item);
  }

  /**
   * Updates an existing item.
   * @param item - The item with updated data.
   * @returns Observable<Item>
   */
  updateItem(item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.itemsUrl}/${item.id}`, item);
  }

  /**
   * Deletes an item by its ID.
   * @param id - The ID of the item to delete.
   * @returns Observable<void>
   */
  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.itemsUrl}/${id}`);
  }
}
