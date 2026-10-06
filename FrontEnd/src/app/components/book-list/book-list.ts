import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../../interfaces/book';

@Component({
  imports: [],
  selector: 'app-book-list',
  styleUrl: './book-list.css',
  templateUrl: './book-list.html',
})
export class BookList {

  // to receive data from parent 
  @Input() books: Book[] = [];

  // for the emitter to work:
  @Output() editBook = new EventEmitter<Book>();
  @Output() deleteBook = new EventEmitter<string>();

  // bagde colors
  getStatusClass(status: string): string {
    switch (status) {
      case 'Finished': return 'text-success';
      case 'To read': return 'text-warning';
      case 'Reading': return 'text-primary';
      default: return 'bg-warning text-dark';
    }
  }

  // notifies signal with book info to parent to open the edit modal
  onEditClick(book: Book): void {
    this.editBook.emit(book);
  }

  // notifies signal with book id to parent to eliminate it 
  deleteClick(id?: string): void {
    if (id) {
      this.deleteBook.emit(id);
    }
  }
}
