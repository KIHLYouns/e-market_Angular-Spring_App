import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Item } from '../../shared/models/item.interface';
import { User } from '../../shared/models/user.interface';
import { environment } from '../../environment/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private itemsUrl = `${environment.apiUrl}/items`;
  private usersUrl = `${environment.apiUrl}/users`;
  
  private currentUserId = 1; // Replace with actual user ID management

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the current user's profile.
   * @returns Observable<User>
   */
  getCurrentProfile(): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${this.currentUserId}`);
  }

  /**
   * Updates the current user's profile.
   * @param profileData - Partial profile data to update.
   * @returns Observable<User>
   */
  updateProfile(profileData: Partial<User>): Observable<User> {
    return this.http.patch<User>(
      `${this.usersUrl}/${this.currentUserId}`,
      profileData
    );
  }

  /**
   * Updates the user's avatar.
   * @param avatarUrl - The new avatar URL.
   * @returns Observable<User>
   */
  updateAvatar(avatarUrl: string): Observable<User> {
    return this.http.patch<User>(`${this.usersUrl}/${this.currentUserId}`, {
      avatar: avatarUrl,
    });
  }

  /**
   * Retrieves the current user's listings (products).
   * @returns Observable<Item[]>
   */
  getListings(): Observable<Item[]> {
    const listingsUrl = `${this.itemsUrl}?sellerId=${this.currentUserId}`;
    return this.http.get<Item[]>(listingsUrl).pipe(
      switchMap((items) => {
        const itemsWithSellers$ = items.map((item) =>
          this.http
            .get<User>(`${this.usersUrl}/${item.sellerId}`)
            .pipe(map((seller) => ({ ...item, seller })))
        );
        return forkJoin(itemsWithSellers$);
      })
    );
  }

  /**
   * Retrieves the current user's saved items.
   * @returns Observable<Item[]>
   */
  getSavedItems(): Observable<Item[]> {
    return this.getCurrentProfile().pipe(
      switchMap((profile) => {
        if (profile.savedItems.length === 0) {
          return of([]);
        }
        const savedItemsObservables = profile.savedItems.map((id) =>
          this.http
            .get<Item>(`${this.itemsUrl}/${id}`)
            .pipe(
              switchMap((item) =>
                this.http
                  .get<User>(`${this.usersUrl}/${item.sellerId}`)
                  .pipe(map((seller) => ({ ...item, seller })))
              )
            )
        );
        return forkJoin(savedItemsObservables);
      })
    );
  }

  /**
   * Adds an item to the user's saved items.
   * @param itemId - The ID of the item to save.
   * @returns Observable<void>
   */
  addSavedItem(itemId: number): Observable<void> {
    return this.getCurrentProfile().pipe(
      switchMap((profile) => {
        if (!profile.savedItems.includes(itemId)) {
          const updatedSavedListings = [...profile.savedItems, itemId];
          return this.http
            .patch(`${this.usersUrl}/${this.currentUserId}`, {
              savedItems: updatedSavedListings,
            })
            .pipe(map(() => {}));
        }
        return of();
      })
    );
  }

  /**
   * Removes an item from the user's saved items.
   * @param itemId - The ID of the item to remove.
   * @returns Observable<void>
   */
  removeSavedItem(itemId: number): Observable<void> {
    return this.getCurrentProfile().pipe(
      switchMap((profile) => {
        if (!profile.savedItems.includes(itemId)) {
          return of();
        }
        const updatedSavedListings = profile.savedItems.filter(
          (id) => id !== itemId
        );
        return this.http
          .patch(`${this.usersUrl}/${this.currentUserId}`, {
            savedItems: updatedSavedListings,
          })
          .pipe(map(() => {}));
      })
    );
  }
}
