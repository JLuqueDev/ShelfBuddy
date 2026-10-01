import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-searchbar',
  styleUrl: './searchbar.css',
  templateUrl: './searchbar.html',
})
export class Searchbar {

  @Output() openAddModal = new EventEmitter<void>();

  onSearch(event: Event): void {
    event.preventDefault();
    console.log('Search triggered (PH)')
  }

  onAddBook(): void {
    this.openAddModal.emit();
  }
}
