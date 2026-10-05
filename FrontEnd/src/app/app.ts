import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//comps
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { Searchbar } from './components/searchbar/searchbar';
import { BookList } from './components/book-list/book-list';
import { Footer } from './components/footer/footer';
import { BookModal } from './components/book-modal/book-modal';
import { AuthModal } from './components/auth-modal/auth-modal';
//models
import { Book } from './interfaces/book';
import { AuthPayload } from './interfaces/user';
// services 
import { AuthService } from './services/auth';

@Component({
  imports: [ Header, Hero, Searchbar, BookList, Footer, BookModal, AuthModal],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})

export class App {
  protected readonly title = signal('FrontEnd');

  // =========================================
  // AUTHENTICATION logic: register/login with jwt
  // =========================================

  // importing authentication service
  private authService = inject(AuthService);

  // takes signal (submitAuth) from authModal and renders user logic
  handleAuthSubmit(event: AuthPayload): void {
    //verifies if user is in login mode and runs login logic
    if (event.mode === 'login') {
      // makes the request to db
      this.authService.login(event.data).subscribe({
        // if backend answers successfully (2xx code), triggers this:
        next: (res) => {
          console.log('Login successfull and JWT stored:', res.token);
          // alert('Logged in successfully!');
          window.location.reload();
        }, 
         // if backend replies an error (like 4xx code), runs this:
        error: (err) => {
          console.error('Login failed:', err.error?.msg || err.message);
          alert(err.error?.msg || 'Login failed!');
        }
      });
    } else {
      // if not in login mode, runs register mode logic 
      this.authService.register(event.data).subscribe({
        // if backend answers successfully (2xx code), triggers this:
        next: (res) => {
          console.log('Registration successful:', res.msg);
          alert('Account created successfully! You can login now.');
        },
        // if backend replies an error (like 4xx code), runs this:
        error: (err) => {
          console.error('Registration failed:', err.error?.msg || err.message);
          alert(err.error?.msg || 'registration failed');
        }
      });
    }
  }


  // =========================================
  // UI logic
  // =========================================

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

  
}

