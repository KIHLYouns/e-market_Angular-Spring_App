import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ProfileService } from '../../../../core/services/profile.service';
import { ItemCardComponent } from '../../../../shared/components/item-card/item-card.component';
import { Item } from '../../../../shared/models/item.interface';
import { RouterModule } from '@angular/router';
import { User } from '../../../../shared/models/user.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ItemCardComponent,
    RouterModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  profile: User | null = null;
  profileForm: FormGroup;
  activeTab: 'listing' | 'saved' = 'listing';
  isEditing = false;
  isLoading = false;
  listing: Item[] = [];
  savedItems: Item[] = [];

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder
  ) {
    this.profileForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      bio: [''],
      location: [''],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadListings();
  }

  /**
   * Loads the current user's profile data.
   */
  loadProfile(): void {
    this.isLoading = true;
    this.profileService
      .getCurrentProfile()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (profile) => {
          this.profile = profile;
          this.profileForm.patchValue({
            fullName: profile.fullName,
            bio: profile.bio,
            location: profile.location,
          });
        },
        error: (error) => {
          console.error('Error loading profile:', error);
        },
      });
  }

  /**
   * Loads the current user's listing (listings).
   */
  loadListings(): void {
    this.profileService
      .getListings()
      .pipe(finalize(() => {}))
      .subscribe({
        next: (listing) => (this.listing = listing),
        error: (error) => {
          console.error('Error loading listing:', error);
        },
      });
  }

  /**
   * Loads the current user's saved listing.
   */
  loadSavedListings(): void {
    this.profileService
      .getSavedItems()
      .pipe(finalize(() => {}))
      .subscribe({
        next: (items) => (this.savedItems = items),
        error: (error) => {
          console.error('Error loading saved listing:', error);
        },
      });
  }

  /**
   * Handles tab changes between 'listing' and 'saved'.
   * @param tab - The selected tab.
   */
  onTabChange(tab: 'listing' | 'saved'): void {
    this.activeTab = tab;
    if (tab === 'saved' && this.savedItems.length === 0) {
      this.loadSavedListings();
    }
  }

  /**
   * Toggles the edit mode for the profile.
   */
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

  /**
   * Submits the updated profile data.
   */
  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.profileService
        .updateProfile(this.profileForm.value)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (profile) => {
            this.profile = profile;
            this.isEditing = false;
          },
          error: (error) => {
            console.error('Error updating profile:', error);
          },
        });
    }
  }

  /**
   * Handles avatar image changes.
   * @param event - The file input change event.
   */
  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      // Implement avatar upload logic here, e.g., uploading to a server or using a service
      const avatarUrl = URL.createObjectURL(file);
      this.profileService.updateAvatar(avatarUrl).subscribe({
        next: (profile) => {
          this.profile = profile;
        },
        error: (err) => {
          console.error('Error updating avatar:', err);
        },
      });
    }
  }
}
