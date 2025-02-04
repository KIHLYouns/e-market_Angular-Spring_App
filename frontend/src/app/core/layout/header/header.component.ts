import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ItemsService } from '../../services/items.service';
import { ProfileService } from '../../services/profile.service';
import { FiltersService } from '../../services/filters.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  appName: string = 'e-market';
  location: string = '';
  searchQuery: string = '';
  showCityDropdown: boolean = false;
  profileImage: string = '';
  cities: string[] = [];

  private subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private profileService: ProfileService,
    private filtersService: FiltersService
  ) {}

  ngOnInit(): void {
    // Subscribe to filters for persistent values.
    this.subscription.add(
      this.filtersService.filters$.subscribe((filters) => {
        this.searchQuery = filters.searchQuery || '';
        this.location = filters.location || '';
      })
    );

    // Retrieve available cities.
    this.itemsService.getLocations().subscribe((locations) => {
      this.cities = ['All', ...locations];
    });

    // Get profile image.
    this.profileService.getCurrentProfile().subscribe((profile) => {
      this.profileImage = profile.avatar;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearch(event: Event): void {
    event.preventDefault();
    this.updateFilters();
    this.router.navigate(['/home']);
  }

  onSelectCity(city: string): void {
    this.location = city === 'All' ? '' : city;
    this.showCityDropdown = false;
    this.updateFilters();
  }

  toggleCityDropdown(): void {
    this.showCityDropdown = !this.showCityDropdown;
  }

  private updateFilters(): void {
    const newFilters = {
      ...this.filtersService.getFilters(),
      searchQuery: this.searchQuery.trim(),
      location: this.location,
    };
    this.filtersService.setFilters(newFilters);
  }
}