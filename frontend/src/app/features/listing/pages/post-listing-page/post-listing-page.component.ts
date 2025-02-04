import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsService } from '../../../../core/services/items.service';

@Component({
  selector: 'app-post-listing',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './post-listing-page.component.html',
  styleUrls: ['./post-listing-page.component.css'],
})
export class PostListingPageComponent implements OnInit, OnDestroy {
  listingForm: FormGroup;
  photos: File[] = [];
  photoUrls: string[] = [];
  maxPhotos = 3;
  conditions = ['New', 'Like New', 'Good', 'Fair'];
  categories: string[] = [];
  cities: string[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private itemsService: ItemsService
  ) {
    this.listingForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      category: ['', Validators.required],
      condition: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.itemsService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this.itemsService.getLocations().subscribe((locations) => {
      this.cities = locations;
    });
  }

  onPhotoSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (this.isValidImage(file)) {
        const url = URL.createObjectURL(file);
        if (index >= this.photoUrls.length) {
          this.photos.push(file);
          this.photoUrls.push(url);
        } else {
          // Revoke the old URL if it exists
          if (this.photoUrls[index]) {
            URL.revokeObjectURL(this.photoUrls[index]);
          }
          this.photos[index] = file;
          this.photoUrls[index] = url;
        }
        this.cdr.detectChanges();
      }
    }
  }

  removePhoto(index: number): void {
    if (this.photoUrls[index]) {
      URL.revokeObjectURL(this.photoUrls[index]);
    }
    this.photos.splice(index, 1);
    this.photoUrls.splice(index, 1);
    this.cdr.detectChanges();
  }

  isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  }

  getPhotoUrl(index: number): string {
    return this.photoUrls[index] || '';
  }

  onSubmit(): void {
    if (this.listingForm.valid && this.photos.length > 0) {
      const formData = new FormData();

      // Append form data
      Object.keys(this.listingForm.value).forEach((key) => {
        formData.append(key, this.listingForm.value[key]);
      });

      // Append photos
      this.photos.forEach((photo, index) => {
        formData.append(`photo${index}`, photo);
      });

      console.log('Form submitted:', {
        ...this.listingForm.value,
        photos: this.photos,
      });

      // Add your form submission logic here
    } else {
      console.log('Form is invalid or no photos selected.');
    }
  }

  getTitleCharCount(): string {
    const current = this.listingForm.get('title')?.value?.length || 0;
    return `${current}/100`;
  }

  getDescriptionCharCount(): string {
    const current = this.listingForm.get('description')?.value?.length || 0;
    return `${current}/500`;
  }

  ngOnDestroy(): void {
    // Cleanup blob URLs
    this.photoUrls.forEach((url) => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    });
  }
}
