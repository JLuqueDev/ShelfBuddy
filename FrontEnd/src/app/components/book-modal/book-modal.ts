import { Component, Input, EventEmitter, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book } from '../../interfaces/book';

@Component({
  imports: [FormsModule],
  selector: 'app-book-modal',
  styleUrl: './book-modal.css',
  templateUrl: './book-modal.html',
})
export class BookModal implements OnChanges {
  
  // If provided, the modal is in "Edit" mode; if undefined, it's in "Add" mode
  @Input() bookToEdit?: Book | null = null;

 // Emits form data back to the parent component on submit   
  @Output() saveBook = new EventEmitter<Partial<Book>>();

  //form state
  title = '';
  author = '';
  status = 'To read';

 // tracking changes
  ngOnChanges(changes: SimpleChanges): void {
    if (this.bookToEdit) {
      // if there is book info, fills data in (to edit). 
      this.title = this.bookToEdit.title;
      this.author = this.bookToEdit.author;
      this.status = this.bookToEdit.status;
    } else {
      // Otherwise, renders empty spaces (to add)
      this.resetForm();
    }
  }

  // takes new (edited or added) data and stores it in variable, 
  onSubmit(): void {
    const payload: Partial<Book> = {
      title: this.title,
      author: this.author,
      status: this.status,
    };

    // attach the _id if editing an existing record
    if (this.bookToEdit?._id) {
      payload._id = this.bookToEdit._id;
    }

    // emit record to parent
    this.saveBook.emit(payload);
    this.resetForm();
  }

    // resets form ready for next use
    resetForm(): void {
      this.title = '';
      this.author = '';
      this.status = 'To read';
  }
}
