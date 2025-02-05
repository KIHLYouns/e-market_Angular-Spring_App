import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent {
  @Input() categories: string[] = [];
  @Input() selectedCategory: string = '';
  @Output() categoryChange = new EventEmitter<string>();

  trackByCategory(index: number, category: string): string {
    return category;
  }

  isActive(category: string): boolean {
    return (category === 'All Items' && !this.selectedCategory) || 
           category === this.selectedCategory;
  }

  onSelect(category: string): void {
    this.categoryChange.emit(category === 'All Items' ? '' : category);
  }
}