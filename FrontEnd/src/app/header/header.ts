import { Component } from '@angular/core';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {

  // sets dark mode off by default
  isDarkMode: boolean = false;

  // on click, changes darkmode boolean status
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode; 

    // if true, tells document to add dark-mode class (taken from styles.css) to whole body
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      // removes dark-mode if false 
      document.body.classList.remove('dark-mode');
    }
  }

  // tells parent to open Auth modal
  openLoginModal(): void {
    console.log('Login modal requested!');
  }
}


