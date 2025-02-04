import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from '../../../../core/services/items.service';
import { Item } from '../../../../shared/models/item.interface';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listing-details-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listing-details-page.component.html',
  styleUrls: ['./listing-details-page.component.css'],
})
export class ListingDetailsPageComponent implements OnInit {
  item!: Item;
  isSaved: boolean = false;
  currentImage: number = 0;

  constructor(
    private route: ActivatedRoute,
    private itemsService: ItemsService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        const id = +params['id'];
        return this.itemsService.getItemById(id);
      })
    ).subscribe({
      next: (item) => {
        this.item = item;
        // Optionally, determine if the item is saved by the current user
      },
      error: (err) => {
        console.error('Error fetching item details:', err);
      }
    });
  }

  toggleSave(): void {
    this.isSaved = !this.isSaved;
    // Implement save/unsave logic via ProfileService
  }

  prevImage(): void {
    this.currentImage =
      (this.currentImage - 1 + this.item.images.length) %
      this.item.images.length;
  }

  nextImage(): void {
    this.currentImage = (this.currentImage + 1) % this.item.images.length;
  }

  selectImage(index: number): void {
    this.currentImage = index;
  }
}