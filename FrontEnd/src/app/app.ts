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
import { BookService } from './services/book';

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
          this.loadBooks();
          // window.location.reload();
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
  // CRUD logic
  // =========================================

  // importing book service
  private bookService = inject(BookService);

  //default state for library
  books: Book[] = [];

  // GET ALL books and keep them in memory only
  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        console.log('Books cached:', this.books.length);
      },
      error: (err) => console.error('Failed to ferch books', err)
    });
  }

  // POST/PUT, takes signal (saveBook) from bookModal and renders logic
  handleSaveBook(bookData: Partial<Book>): void {
    if (bookData._id) {
      //if it has an ID, updates(PUT) it
      this.bookService.updateBook(bookData._id, bookData).subscribe({
        next: () => this.loadBooks(), // refreshe list on success
        error: (err) => alert(err.error?.error || 'Failed to update book')
      });
    } else {
      //No ID, so add (POST) a new book
      this.bookService.addBook(bookData).subscribe({
        next: () => this.loadBooks(), //refreshes on success
        error: (err) => alert(err.error?.error || 'Failed to add book')
      });
    }
  }

  // DELETE 
  handleDeleteBook(id: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => this.loadBooks(), //refreshes on success
        error: (err) => console.error('Failed to delete book', err)
      });
    }
  }

  // =========================================
  // UI logic
  // =========================================

  //  to cache books in memory on page load
  ngOnInit(): void {
    if (this.authService.currentUser()) {
      this.loadBooks(); // to silentyl cache books in memory
    }
  }

   // book section invisible by default
  displayBooks: boolean = false;

  // take signal (showLibrary) from hero logo and displays book list
  bookList(): void {
    console.log('Root received the displaybooks event!');
    this.displayBooks = !this.displayBooks;
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

}

