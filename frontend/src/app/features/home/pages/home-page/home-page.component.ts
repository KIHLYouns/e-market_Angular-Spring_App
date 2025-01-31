import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from '../../../../core/services/items.service';
import { ItemCardComponent } from '../../../../shared/components/item-card/item-card.component';
import { Item, ItemFilters } from '../../../../shared/models/item.interface';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ItemCardComponent, CommonModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  items: Item[] = [];
  categories: string[] = [];

  filters: ItemFilters = {
    category: 'All Items',
    minPrice: undefined,
    maxPrice: undefined,
    condition: [],
    searchQuery: '',
    location: '',
  };

  constructor(
    private itemsService: ItemsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.categories = this.itemsService.getCategories();

    // Subscribe to query params for search
    this.route.queryParams.subscribe((params) => {
      if (params['search']) {
        this.filters.searchQuery = params['search'];
      } else {
        this.filters.searchQuery = '';
      }
      if (params['location']) {
        this.filters.location = params['location'];
      } else {
        this.filters.location = '';
      }
      this.items = this.itemsService.getItems(this.filters);
    });
  }

  private applyFilters() {
    this.items = this.itemsService.getItems(this.filters);
  }

  onCategoryChange(category: string) {
    this.filters.category = category;
    this.applyFilters();
  }

  onPriceChange() {
    this.applyFilters();
  }

  onConditionChange(condition: string, checked: boolean) {
    if (checked) {
      this.filters.condition?.push(condition);
    } else {
      this.filters.condition = this.filters.condition?.filter(
        (c) => c !== condition
      );
    }
    this.applyFilters();
  }

  onSearch(query: string) {
    this.filters.searchQuery = query;
    this.applyFilters();
  }
}
