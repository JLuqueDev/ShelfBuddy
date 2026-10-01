import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Hero } from './hero/hero';
import { BookList } from './book-list/book-list';

@Component({
  imports: [ Header, Hero, BookList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('FrontEnd');

  // book section visible/invisible
  displayBooks: boolean = false;
  bookList(): void {
    console.log('2. App shell received the event!');
    this.displayBooks = true;
  }
}

