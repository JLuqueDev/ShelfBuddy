import { Component, Input, EventEmitter, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book } from '../models/bookModel';

@Component({
  imports: [FormsModule],
  selector: 'app-book-modal',
  styleUrl: './book-modal.css',
  templateUrl: './book-modal.html',
})
export class BookModal implements OnChanges {

  @Input() bookToEdit?: Book | null = null;

  @Output() saveBook = new EventEmitter<Partial<Book>>();

  title = '';
  author = '';
  status = 'To read';

  ngOnChanges(changes: SimpleChanges): void {
    if (this.bookToEdit) {
      this.title = this.bookToEdit.title;
      this.author = this.bookToEdit.author;
      this.status = this.bookToEdit.status;
    } else {
      this.resetForm();
    }
  }
  onSubmit(): void {
    const payload: Partial<Book> = {
      title: this.title,
      author: this.author,
      status: this.status,
    };
    
    if (this.bookToEdit?._id) {
      payload._id = this.bookToEdit._id;
    }

    this.saveBook.emit(payload);
    this.resetForm();
  }
  resetForm(): void {
    this.title = '';
    this.author = '';
    this.status = 'To read';
  }
}
