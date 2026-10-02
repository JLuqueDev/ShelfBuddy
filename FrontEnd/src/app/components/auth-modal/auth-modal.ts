import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthPayload } from '../../models/authModel';

@Component({
  imports: [FormsModule],
  selector: 'app-auth-modal',
  styleUrl: './auth-modal.css',
  templateUrl: './auth-modal.html',
})
export class AuthModal {

  // Mode flag: true on default, shows login mode
  isLoginMode = true;

  //login field
  identifier = '';
  
  //reguster field
  username = '';
  email = '';

  //common field
  password = '';

  // for emmiter to work
  @Output() submitAuth = new EventEmitter<AuthPayload>()

  // swith: when clicking on 'Sign up!/log in' changes boolean status
  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    // resets form for clean inputs
    this.resetForm();
  }

  // clickin on login/register logic:
  onSubmit(): void {
    // when the login mode is true(on):
    if (this.isLoginMode) {
      //takes user inputs, stores them in variable and sends them to parent
      this.submitAuth.emit({
        mode: 'login',
        data: {
          identifier: this.identifier,
          password: this.password
        }
      });
      // when login mode off (register):
    } else {
      //takes user inputs, stores them in variable and sends them to parent
      this.submitAuth.emit({
        mode: 'register',
        data: {
          username: this.username,
          email: this.email,
          password: this.password
        }
      });
    }
    //calls reset function at the end of submition
    this.resetForm();
  }
  // clears form for future actions:
  resetForm(): void {
    this.identifier = '';
    this.username = '';
    this.email = '';
    this.password = '';
  }
}