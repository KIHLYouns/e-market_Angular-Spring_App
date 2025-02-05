import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { CategoryListComponent } from '../../components/category-list/category-list.component';
import { FilterSidebarComponent } from '../../components/filter-sidebar/filter-sidebar.component';
import { ItemsGridComponent } from '../../components/items-grid/items-grid.component';
import { ItemsService } from '../../../../core/services/items.service';
import { FiltersService } from '../../../../core/services/filters.service';
import { Item, ItemFilters } from '../../../../shared/models/item.interface';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    CategoryListComponent,
    FilterSidebarComponent,
    ItemsGridComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  categories: string[] = [];
  filters: ItemFilters = {
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    condition: [],
    searchQuery: '',
    location: '',
    sort: '',
  };
  isMobileFiltersOpen = false;
  isLoading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private itemsService: ItemsService,
    private filtersService: FiltersService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.subscribeToFiltersChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToFiltersChanges(): void {
    this.filtersService.filters$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.filters = filters;
        this.loadItems();
      });
  }

  private loadCategories(): void {
    this.itemsService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => (this.categories = ['All Items', ...categories]),
        error: (error) => {
          console.error('Error loading categories:', error);
          this.error = 'Failed to load categories';
        },
      });
  }

  private loadItems(): void {
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
          console.error('Error loading items:', error);
          this.error = 'Failed to load items';
          this.isLoading = false;
        },
      });
  }

  onCategoryChange(category: string): void {
    this.updateFilters({ category });
  }

  onFilterChange(newFilters: ItemFilters): void {
    this.updateFilters(newFilters);
  }

  private updateFilters(partialFilters: Partial<ItemFilters>): void {
    const newFilters = {
      ...this.filtersService.getFilters(),
      ...partialFilters,
    };
    this.filtersService.setFilters(newFilters);
  }

  clearFilters(): void {
    this.filtersService.clearFilters();
  }

  toggleMobileFilters(): void {
    this.isMobileFiltersOpen = !this.isMobileFiltersOpen;
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

  get isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.filters.category) count++;
    if (this.filters.minPrice || this.filters.maxPrice) count++;
    if (this.filters.condition?.length) count++;
    if (this.filters.sort) count++;
    return count;
  }
}
