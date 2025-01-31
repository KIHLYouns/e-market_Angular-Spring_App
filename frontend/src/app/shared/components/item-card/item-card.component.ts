import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Item } from '../../models/item.interface';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css'],
})
export class ItemCardComponent {
  @Input() item!: Item;
}
