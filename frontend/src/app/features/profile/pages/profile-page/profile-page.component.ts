import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Profile } from '../../models/profile.interface';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ProductCardComponent],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  profile: Profile | null = null;
  profileForm: FormGroup;
  activeTab: 'listings' | 'saved' = 'listings';
  isEditing = false;
  isLoading = false;
  listings: any[] = [];
  savedItems: any[] = [];

  constructor(private profileService: ProfileService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      bio: [''],
      location: [''],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadListings();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService
      .getCurrentProfile()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((profile) => {
        this.profile = profile;
        this.profileForm.patchValue({
          fullName: profile.fullName,
          bio: profile.bio,
          location: profile.location,
        });
      });
  }

  loadListings(): void {
    this.profileService
      .getListings()
      .subscribe((listings) => (this.listings = listings));
  }

  loadSavedItems(): void {
    this.profileService
      .getSavedItems()
      .subscribe((items) => (this.savedItems = items));
  }

  onTabChange(tab: 'listings' | 'saved'): void {
    this.activeTab = tab;
    if (tab === 'saved' && this.savedItems.length === 0) {
      this.loadSavedItems();
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.profile) {
      this.profileForm.patchValue({
        fullName: this.profile.fullName,
        bio: this.profile.bio,
        location: this.profile.location,
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.profileService
        .updateProfile(this.profileForm.value)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((profile) => {
          this.profile = profile;
          this.isEditing = false;
        });
    }
  }

  onAvatarChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.isLoading = true;
      this.profileService
        .updateAvatar(file)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((response) => {
          if (this.profile) {
            this.profile.avatar = response.avatarUrl;
          }
        });
    }
  }

  mapListingToProduct(listing: any): any {
    return {
      id: listing.id,
      title: listing.title,
      price: listing.price,
      location: listing.location,
      images: [listing.imageUrl],
    };
  }
}
