import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from '../../../../core/services/items.service';
import { Item } from '../../../../shared/models/item.interface';

@Component({
  selector: 'app-listing-page',
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
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.fetchItemDetails(id);
    });
  }

  private fetchItemDetails(id: number): void {
    this.item = this.itemsService.getItemById(id);
  }

  toggleSave(): void {
    this.isSaved = !this.isSaved;
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
