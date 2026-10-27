import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-searchbar',
  styleUrl: './searchbar.css',
  templateUrl: './searchbar.html',
})
export class Searchbar {

  //search and add book logic 
  @Output() openAddModal = new EventEmitter<void>();

  @Output() searchChange = new EventEmitter<string>();
 
  // tells parent to do a search in real time
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }
  onSearch(event: Event): void {
    event.preventDefault(); // to prevent page reload
  }

  // notifies signal to parent to open the creation modal
  onAddBook(): void {
    this.openAddModal.emit();
  }
}
