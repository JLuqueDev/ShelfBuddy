import { Component, EventEmitter, Output } from '@angular/core';
import { Book } from '../../interfaces/book';

@Component({
  imports: [],
  selector: 'app-book-list',
  styleUrl: './book-list.css',
  templateUrl: './book-list.html',
})
export class BookList {

  // for the emitter to work:
  @Output() editBook = new EventEmitter<Book>();

  // mock book list to be replaced with DB logic (later)
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

  // notifies signal with book info to parent to open the edit modal
  onEditClick(book: Book): void {
    this.editBook.emit(book);
  }

  // notifies signal with book id to parent to eliminate it 
  deleteBook(id: string): void {
    console.log('Delete clicked for', id);
  }
}
