import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';


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

  // import auth service to read login status and swap login button to logout.
  public authService = inject(AuthService);
}


