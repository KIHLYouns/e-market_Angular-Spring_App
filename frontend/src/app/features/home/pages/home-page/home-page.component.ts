import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from '../../../../core/services/items.service';
import { ItemCardComponent } from '../../../../shared/components/item-card/item-card.component';
import { Item, ItemFilters } from '../../../../shared/models/item.interface';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FiltersService } from '../../../../core/services/filters.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ItemCardComponent, CommonModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  categories: string[] = [];
  filters: ItemFilters;
  isMobileFiltersOpen: boolean = false;
  isLoading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private filtersService: FiltersService
  ) {
    this.filters = this.filtersService.getFilters();
  }

  ngOnInit() {
    this.loadCategories();

    // Subscribe to filter changes (persisted via header) and load items
    this.filtersService.filters$
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe((updatedFilters) => {
        this.filters = updatedFilters;
        this.loadItems();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Fetch items based on the current filters.
   */
  loadItems() {
    this.isLoading = true;
    this.error = null;

    this.itemsService
      .getItems(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.items = items;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Failed to load Items. Please try again.';
          this.isLoading = false;
          console.error('Error fetching items:', error);
        },
      });
  }

  /**
   * Fetch all categories and prepend 'All Items'.
   */
  loadCategories() {
    this.itemsService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) =>
          (this.categories = ['All Items', ...categories]),
        error: (error) => {
          this.error = 'Failed to load categories. Please try again.';
          console.error('Error fetching categories:', error);
        },
      });
  }

  private updateFilters(): void {
    const newFilters = {
      ...this.filtersService.getFilters(),
      category: this.filters.category,
      minPrice: this.filters.minPrice,
      maxPrice: this.filters.maxPrice,
      condition: this.filters.condition,
      sort: this.filters.sort
    };
    this.filtersService.setFilters(newFilters);
  }

  /**
   * Handler for category change.
   * @param category - The selected category
   */
  onCategoryChange(category: string) {
    this.filters.category = category === 'All Items' ? '' : category;
    this.updateFilters();
  }

  /**
   * Handler for price range change.
   */
  onPriceChange(): void {
    if (this.filters.minPrice && this.filters.maxPrice) {
      if (this.filters.minPrice > this.filters.maxPrice) {
        const temp = this.filters.minPrice;
        this.filters.minPrice = this.filters.maxPrice;
        this.filters.maxPrice = temp;
      }
    }
    this.updateFilters();
  }

  /**
   * Handler for condition filter change.
   * @param condition - Condition to filter
   * @param checked - Whether the condition is checked
   */
  onConditionChange(condition: string, checked: boolean) {
    if (!this.filters.condition) {
      this.filters.condition = [];
    }
    if (checked) {
      this.filters.condition.push(condition);
    } else {
      this.filters.condition = this.filters.condition.filter(
        (c) => c !== condition
      );
    }
    this.updateFilters();
  }

  onSortChange() {
    this.updateFilters();
  }

  toggleMobileFilters(): void {
    this.isMobileFiltersOpen = !this.isMobileFiltersOpen;
  }

  trackByItemId(index: number, item: Item): number {
    return item.id;
  }

  get hasFilters(): boolean {
    return !!(
      this.filters.category ||
      this.filters.minPrice ||
      this.filters.maxPrice ||
      (this.filters.condition && this.filters.condition.length > 0) ||
      this.filters.sort
    );
  }

  clearFilters() {
    this.filters = {
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      condition: [],
      sort: '',
    };
    this.updateFilters();
  }
}