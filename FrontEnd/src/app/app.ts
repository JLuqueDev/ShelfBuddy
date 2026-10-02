import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Hero } from './hero/hero';
import { BookList } from './book-list/book-list';
import { Searchbar } from './searchbar/searchbar';
import { Footer } from './footer/footer';
import { BookModal } from './book-modal/book-modal';
import { Book } from './models/bookModel';
import { AuthModal } from './auth-modal/auth-modal';
import { AuthPayload } from './models/authModel';

@Component({
  imports: [ Header, Hero, Searchbar, BookList, Footer, BookModal, AuthModal],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})

export class App {
  protected readonly title = signal('FrontEnd');

  // book section invisible by default
  displayBooks: boolean = false;

  // take signal (showLibrary) from hero logo and displays book list
  bookList(): void {
    console.log('App shell received the displaybooks event!');
    this.displayBooks = true;
  }

  // empty or not book variable
  selectedBook: Book | null = null;

  // takes signal (openAddModal) from searchbar and makes it empty to create a book 
  openAddModal(): void {
    this.selectedBook = null;
  }
  // takes signal (editBook) from bookList and puts Book values on it to edit 
  openEditModal(book: Book): void {
    this.selectedBook = book;
  }
  // takes signal (saveBook) from bookModal and renders logic
  handleSaveBook(bookData: Partial<Book>): void {
    if (bookData._id) {
      console.log('Updating existing book (PUT):', bookData);
    } else {
      console.log('Adding new book (POST):', bookData);
    }
  }

  // takes signal (submitAuth) from authModal and renders user logic
  handleAuthSubmit(event: AuthPayload): void {
    if (event.mode === 'login') {
      console.log('Loggin in!', event.data);
      // API call: POST /api/users/login with event.data
    } else {
      console.log('Registering user:', event.data);
      // Future API call: POST /api/users/register with event.data
    }
  }
}

