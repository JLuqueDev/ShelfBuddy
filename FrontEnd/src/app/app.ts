import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Hero } from './hero/hero';
import { BookList } from './book-list/book-list';
import { Searchbar } from './searchbar/searchbar';
import { Footer } from './footer/footer';
import { BookModal } from './book-modal/book-modal';
import { Book } from './models/bookModel';

@Component({
  imports: [ Header, Hero, Searchbar, BookList, Footer, BookModal],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})

export class App {
  protected readonly title = signal('FrontEnd');

  // book section visible/invisible
  displayBooks: boolean = false;
  bookList(): void {
    // console.log('2. App shell received the event!');
    this.displayBooks = true;
  }

  // 
  selectedBook: Book | null = null;

  // to create new book
  openAddModal(): void {
    this.selectedBook = null;
  }
  // to edit existing book
  openEditModal(book: Book): void {
    this.selectedBook = book;
  }
  // to handle data from edit/new modal
  handleSaveBook(bookData: Partial<Book>): void {
    if (bookData._id) {
      console.log('Updating existing book (PUT):', bookData);
    } else {
      console.log('Adding new book (POST):', bookData);
    }
  }
}

