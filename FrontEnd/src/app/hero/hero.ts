import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {

  @Output() showLibrary = new EventEmitter<void>();

  showLibraryClick(): void {
    console.log('1. Hero logo was clicked!'); // Tests if the HTML click works
    this.showLibrary.emit();
  }
}
