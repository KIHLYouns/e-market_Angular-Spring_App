import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemFilters } from '../../../../shared/models/item.interface';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.css']
})
export class FilterSidebarComponent {
  @Input() filters!: ItemFilters;
  @Input() isMobile = false;
  @Input() isOpen = false;
  @Output() filterChange = new EventEmitter<ItemFilters>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() toggleMobile = new EventEmitter<void>();

  readonly conditions = ['New', 'Like New', 'Good', 'Fair'];
  readonly sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' }
  ];

  onPriceChange(): void {
    if (this.filters.minPrice && this.filters.maxPrice) {
      if (this.filters.minPrice > this.filters.maxPrice) {
        [this.filters.minPrice, this.filters.maxPrice] = 
        [this.filters.maxPrice, this.filters.minPrice];
      }
    }
    this.emitChange();
  }

  onConditionChange(condition: string, checked: boolean): void {
    const conditions = this.filters.condition || [];
    if (checked) {
      conditions.push(condition);
    } else {
      const index = conditions.indexOf(condition);
      if (index > -1) {
        conditions.splice(index, 1);
      }
    }
    this.filters = { ...this.filters, condition: conditions };
    this.emitChange();
  }

  onSortChange(value: string): void {
    this.filters = { ...this.filters, sort: value };
    this.emitChange();
  }

  private emitChange(): void {
    this.filterChange.emit(this.filters);
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filters.category ||
      this.filters.minPrice ||
      this.filters.maxPrice ||
      (this.filters.condition && this.filters.condition.length > 0) ||
      this.filters.sort
    );
  }
}