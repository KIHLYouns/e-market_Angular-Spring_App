import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardComponent } from '../../../../shared/components/item-card/item-card.component';
import { Item } from '../../../../shared/models/item.interface';

@Component({
  selector: 'app-items-grid',
  standalone: true,
  imports: [CommonModule, ItemCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './items-grid.component.html',
  styleUrls: ['./items-grid.component.css'],
})
export class ItemsGridComponent {
  @Input() items: Item[] = [];
  @Input() isLoading = false;
  @Input() error: string | null = null;
  @Input() hasFilters = false;
  @Output() clearFilters = new EventEmitter<void>();

  trackByItemId(index: number, item: Item): number {
    return item.id;
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }
}
