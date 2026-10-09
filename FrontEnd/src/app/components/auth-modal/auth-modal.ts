import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthPayload } from '../../interfaces/user';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-auth-modal',
  styleUrl: './auth-modal.css',
  templateUrl: './auth-modal.html',
})
export class AuthModal {
  private fb = inject(FormBuilder);

  // for emmiter to work
  @Output() submitAuth = new EventEmitter<AuthPayload>();

  // Mode flag: true on default, shows login mode
  isLoginMode = true;

  authForm: FormGroup = this.fb.group({
    identifier: [''],  // login mode (username OR email)
    username: [''],    // register mode
    email: [''],       // register mode
    password: ['', [Validators.required, Validators.minLength(6)]]  // both modes
  });

  ngOnInit(): void {
    this.updateModeValidators();
  }
  
  // swith: when clicking on 'Sign up!/log in' changes boolean status
  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    // resets form for clean inputs
    this.authForm.reset();
    this.updateModeValidators();
  }

  private updateModeValidators(): void {
    const identifierCtrl = this.authForm.get('identifier');
    const usernameCtrl = this.authForm.get('username');
    const emailCtrl = this.authForm.get('email');

    if (this.isLoginMode) {
      identifierCtrl?.setValidators([Validators.required]);
      usernameCtrl?.clearValidators();
      emailCtrl?.clearValidators();
    } else {
      identifierCtrl?.clearValidators();
      usernameCtrl?.setValidators([Validators.required, Validators.minLength(3)]);
      emailCtrl?.setValidators([Validators.required, Validators.email]);
    }

    identifierCtrl?.updateValueAndValidity();
    usernameCtrl?.updateValueAndValidity();
    emailCtrl?.updateValueAndValidity();
  }

  get identifierControl() { return this.authForm.get('identifier'); }
  get usernameControl() { return this.authForm.get('username'); }
  get emailControl() { return this.authForm.get('email'); }
  get passwordControl() { return this.authForm.get('password'); }

  // clickin on login/register logic:
  onSubmit(): void {
    if (this.authForm.valid) {
      //takes user inputs, stores them in variable and sends them to parent
      const val = this.authForm.value;
      
      if (this.isLoginMode) {
        // to emit the login variant
        this.submitAuth.emit({
          mode: 'login',
          data: {
            identifier: val.identifier,
            password: val.password
          }
        });
      } else {
        // emits the register variant 
        this.submitAuth.emit({
          mode: 'register',
          data: {
            username: val.username,
            email: val.email,
            password: val.password
          }
        });
      }
    } else {
    this.authForm.markAllAsTouched();
    }
  }
} 