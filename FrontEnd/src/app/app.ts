import { Component, inject, signal, effect, OnInit, computed, } from '@angular/core';
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
import { Alert } from './services/alert';

@Component({
  imports: [ Header, Hero, Searchbar, BookList, Footer, BookModal, AuthModal],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})

export class App implements OnInit {
  protected readonly title = signal('FrontEnd');

  // =========================================
  // AUTHENTICATION logic: register/login with jwt
  // =========================================

  // importing AlertService 
  private alertService = inject(Alert);

  // importing authentication service 
  public authService = inject(AuthService);

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
          this.alertService.success(
          'Login Successful',
          'Click on the book icon to see your library!'
        )
          this.loadBooks(); //fetch and cache books for new logged user
          // window.location.reload();
        }, 
         // if backend replies an error (like 4xx code), runs this:
        error: (err) => {
          console.error('Login failed:', err.error?.msg || err.message);
          this.alertService.error(
            'Login failed!',
            `${err.error?.msg}`
          )
        }
      });
    } else {
      // if not in login mode, runs register mode logic 
      this.authService.register(event.data).subscribe({
        // if backend answers successfully (2xx code), triggers this:
        next: (res) => {
          console.log('Registration successful:', res.msg);
          // alert('Account created successfully! You can login now.');
          this.alertService.success(
            'Account created!',
            'You can log in now'
          )
        },
        // if backend replies an error (like 4xx code), runs this:
        error: (err) => {
          console.error('Registration failed:', err.error?.msg || err.message);
          // alert(err.error?.msg || 'registration failed');
          this.alertService.error(
            'Registration failed',
            `${err.error?.msg}`
          )
        }
      });
    }
  }

  // =========================================
  // CRUD logic
  // =========================================

  // importing book service
  private bookService = inject(BookService);

  //turning books array into a signal
  books = signal<Book[]>([]);

  // GET ALL books and keep them in memory only
  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        // set book signal with fetched data 
        this.books.set(data);
        console.log('Books cached:', this.books().length);
      },
      error: (err) => console.error('Failed to fetch books', err)
    });
  }

  // POST/PUT, takes signal (saveBook) from bookModal and renders logic
  handleSaveBook(bookData: Partial<Book>): void {
    if (bookData._id) {
      //if it has an ID, updates(PUT) it
      this.bookService.updateBook(bookData._id, bookData).subscribe({
        next: () => {
          this.loadBooks() // refreshe list on success
          this.alertService.success('Book edited', 'Data updated successfully!');
        }, 
        error: (err) => {
          // alert(err.error?.error || 'Failed to update book')
          const errorList = err.error?.errors;
          let errorMsg = 'Unexpected error';
            if (errorList && errorList.length > 0) {
              errorMsg = errorList.map((e: any) => e.msg).join('<br>');
            }
            this.alertService.error('Failed to update book', errorMsg);
        }
      });
    } else {
      //No ID, so add (POST) a new book
      this.bookService.addBook(bookData).subscribe({
        next: () => {
          this.loadBooks() //refreshes on success
          this.alertService.success('Book Added!', 'New book data successfully saved!');
        }, 
        error: (err) => {
          // alert(err.error?.error || 'Failed to add book')
        const errorList = err.error?.errors;
        let errorMsg = '';
          if (errorList && errorList.length > 0) {
              errorMsg = errorList.map((e: any) => e.msg).join('<br>');
            } else {
              errorMsg = err.error?.error || err.error?.message || 'An unexpected error occurred';
            }
        this.alertService.error('Failed to add book', errorMsg);
    }
      });
    }
  }

  // DELETE 
  deleteClick(id: string): void {
    this.alertService.confirm(
      'Are you sure you want to delete this book?',
      'This cannot be undone.'
    ).then((result) => {
      if (result.isConfirmed) {
        this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.alertService.success('Deleted!', 'Book removed from your library.');
          // to update the book signal reactively
          this.books.update(currentBooks => currentBooks.filter(book => book._id !== id));
            },
            error: (err) => {
              console.error('Failed to delete book', err)
              this.alertService.error('Error', err.error?.error || 'Could not delete book.')
            }
          });
        }
      });
    }

  // =========================================
  // UI logic
  // =========================================

  // ON PAGE LOAD:
  ngOnInit(): void {
    if (this.authService.currentUser()) {
      this.loadBooks(); // to silently cache books in memory
    }
  }

  // AUTOMATIC CLEANUP ON USER CHANGE/LOGOUT
  constructor() {
    // reactive cleanup to repond on currentUser updates
    effect(() => {
      if (!this.authService.currentUser()) {
        this.books.set([]); // reset book signal on logout
        this.displayBooks = false; // hides the library UI
        // this.authService.logout;
      }
    });
  }
  
  // ACTION LOGO BUTTON: 
  // book section invisible by default
  displayBooks: boolean = false;
  // take signal (showLibrary) from hero logo and displays book list
  bookList(): void {
    console.log('Root received the displaybooks event!');
    if (!this.authService.currentUser()) {
      // alert('Please register or log in to view your personal library!')
      this.alertService.error('Oops!', 'Please register or log in to view your personal library!')
      return;
    }
    this.displayBooks = !this.displayBooks;
  }

  // EDIT OR ADD BOOK MODAL:  
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

  // search bar logic
  searchQuery = signal<string>('');

  filteredBooks = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allBooks = this.books();

    if (!query) return allBooks;

    return allBooks.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  });
  onSearch(query: string): void {
    this.searchQuery.set(query);
  }
}

