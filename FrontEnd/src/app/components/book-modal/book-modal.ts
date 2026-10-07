import { Component, Input, EventEmitter, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book } from '../../interfaces/book';

@Component({
  imports: [FormsModule],
  selector: 'app-book-modal',
  styleUrl: './book-modal.css',
  templateUrl: './book-modal.html',
})
export class BookModal {

 // Emits form data back to the parent component on submit   
  @Output() saveBook = new EventEmitter<Partial<Book>>();

  //form state
  formData: Partial<Book> = {
  title: '',
  author: '',
  status: 'To read'
  };

  // trigger set on selectedBook changes in parent
  @Input() set book(selectedBook: Book | null) {
    if (selectedBook) {
      // makes copy for changes do not change parent state before saving
      this.formData = { ...selectedBook };
    } else {
      // reset form on add mode
      this.formData = { title: '', author: '', status: 'To read'};
    }
  }


  // takes new (edited or added) data and stores it in variable, 
  onSubmit(): void {
    this.saveBook.emit(this.formData);
    }

  
}
