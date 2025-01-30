import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule, NgFor} from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  appName: string = 'e-market';
  location: string = 'Tetouan';
  searchQuery: string = '';
  showCityDropdown: boolean = false;

  moroccanCities: string[] = [
    'Tetouan',
    'Tangier',
    'Casablanca',
    'Rabat',
    'Fez',
    'Marrakech',
    'Agadir',
    'Oujda',
    'Meknes',
    'Kenitra',
    'Sale',
    'Nador',
    'Al Hoceima'
  ];

  constructor(private router: Router) {}

  onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim() || this.location) {
      this.router.navigate(['/home'], {
        queryParams: { 
          search: this.searchQuery.trim(),
          location: this.location 
        }
      });
    }
  }

  toggleCityDropdown(): void {
    this.showCityDropdown = !this.showCityDropdown;
  }

  selectCity(city: string): void {
    this.location = city;
    this.showCityDropdown = false;
  }
}
