import { Component, EventEmitter, Output } from '@angular/core';
import { Book } from '../models/bookModel';

@Component({
  imports: [],
  selector: 'app-book-list',
  styleUrl: './book-list.css',
  templateUrl: './book-list.html',
})
export class BookList {

  @Output() editBook = new EventEmitter<Book>();

  books: Book[] = [
   { _id: '1', title: 'The Hobbit', author: 'J.R.R. Tolkien', status: 'Finished' },
    { _id: '2', title: 'Dune', author: 'Frank Herbert', status: 'Reading' }
  ];
  // bagde colors
  getStatusClass(status: string): string {
    switch (status) {
      case 'Finished': return 'text-success';
      case 'To read': return 'text-warning';
      case 'Reading': return 'text-primary';
      default: return 'bg-warning text-dark';
    }
  }

  onEditClick(book: Book): void {
    this.editBook.emit(book);
  }

  deleteBook(id: string): void {
    console.log('Delete clicked for', id);
  }
}
