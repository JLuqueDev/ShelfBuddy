import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {

  // for emitter to work
  @Output() showLibrary = new EventEmitter<void>();

  // notifies signal to parent to show books list
  showLibraryClick(): void {
    console.log('Hero logo clicked!'); // Tests if the HTML click works
    this.showLibrary.emit();
  }
}
