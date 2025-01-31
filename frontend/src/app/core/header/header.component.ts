import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  appName: string = 'e-market';
  location: string = 'Tetouan';
  searchQuery: string = '';
  showCityDropdown: boolean = false;
  private searchSubject = new Subject<string>();
  private subscription = new Subscription();

  moroccanCities: string[] = [
    'Tetouan', 'Tangier', 'Casablanca', 'Rabat', 
    'Fez', 'Marrakech', 'Agadir', 'Oujda', 
    'Meknes', 'Kenitra', 'Sale', 'Nador', 'Al Hoceima'
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize search with debounce
    this.subscription.add(
      this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(query => this.performSearch(query))
    );
  }

  ngOnInit(): void {
    // Sync with URL parameters
    this.subscription.add(
      this.route.queryParams.subscribe(params => {
        this.searchQuery = params['search'] || '';
        this.location = params['location'] || 'Tetouan';
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onSearch(event: Event): void {
    event.preventDefault();
    this.performSearch(this.searchQuery);
  }

  private performSearch(query: string): void {
    if (query.trim() || this.location) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          search: query.trim(),
          location: this.location
        },
        queryParamsHandling: 'merge'
      });
    }
  }

  selectCity(city: string): void {
    this.location = city;
    this.showCityDropdown = false;
    this.performSearch(this.searchQuery);
  }

  toggleCityDropdown(): void {
    this.showCityDropdown = !this.showCityDropdown;
  }
}
