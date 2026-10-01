import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-searchbar',
  styleUrl: './searchbar.css',
  templateUrl: './searchbar.html',
})
export class Searchbar {

  //for the emitter to work:
  @Output() openAddModal = new EventEmitter<void>();

  // tells parent to do a search
  onSearch(event: Event): void {
    event.preventDefault();
    console.log('Search triggered (PH)')
  }

  // notifies signal to parent to open the creation modal
  onAddBook(): void {
    this.openAddModal.emit();
  }
}
