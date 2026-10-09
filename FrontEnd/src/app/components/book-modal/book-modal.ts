import { Component, Input, EventEmitter, Output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../interfaces/book';
import { Title } from '@angular/platform-browser';

@Component({
  imports: [ ReactiveFormsModule ],
  selector: 'app-book-modal',
  styleUrl: './book-modal.css',
  templateUrl: './book-modal.html',
})
export class BookModal {
  private fb = inject(FormBuilder);

 // Emits form data back to the parent component on submit   
  @Output() saveBook = new EventEmitter<Partial<Book>>();

  //reactive form state with validators 
  bookForm: FormGroup = this.fb.group({
    _id: [null],
    title: ['', [Validators.required, Validators.minLength(2)]],
    author: ['', [Validators.required]],
    status: ['To read', [Validators.required]]
  });
  
  // formData: Partial<Book> = {
  // title: '',
  // author: '',
  // status: 'To read'
  // };

  // trigger set on selectedBook changes in parent
  @Input() set book(selectedBook: Book | null) {
    if (selectedBook) {
      // sets values in patch from input 
      this.bookForm.patchValue(selectedBook);
    } else {
      // reset form on add mode
      this.bookForm.reset({
        _id: null,
        title: '',
        author: '',
        status: 'To read'
      });
    }
  }

  // getters for validation checks
  get titleControl() { return this.bookForm.get('title');}
  get authorControl() { return this.bookForm.get('author');}

  // takes new (edited or added) data and stores it in variable, 
  onSubmit(): void {
    // console.log('Submitting formData:', this.formData);
    if (this.bookForm.valid) {
      this.saveBook.emit(this.bookForm.value);
    } else {
      this.bookForm.markAllAsTouched(); //to high ligth fields if user attempts empty submission
    }
  }
}
