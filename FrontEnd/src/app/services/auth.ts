import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { LoginPayload, RegisterPayload } from "../interfaces/user";
import Swal from "sweetalert2";

@Injectable({
    //share global instance to whole app
    providedIn: 'root'
})
export class AuthService {
    // connects angular with http tool, backend endpoint cluster and the JWT
    private http = inject(HttpClient);
    private apiURL = 'http://localhost:3000/api/users';
    private tokenKey = 'shelfbuddy_token';

    // register endpoint
    register(credentials: RegisterPayload): Observable<{ msg: string}> {
        return this.http.post<{ msg: string}> (`${this.apiURL}/register`, credentials);
    }

    // signal to hold current username or null
    currentUser = signal<string | null>(this.getUsernameFromToken());

    //login endpoint
    login(credentials: LoginPayload): Observable<{ token: string}> {
        return this.http.post<{ token: string }> (`${this.apiURL}/login`, credentials).pipe(
            tap(response => {
                if (response.token) {
                    localStorage.setItem(this.tokenKey, response.token);
                    // updates signal on login
                    this.currentUser.set(this.getUsernameFromToken());
                }
            })
        );
    }
    // to retrieve token for api headers
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    // to clean token on logout and reload whole page
    logout(): void {
        Swal.fire({
            title: 'Are you sure?',
            // theme: 'auto',
            text: 'You will be logged out of your session.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, log out',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem(this.tokenKey);
                // clears signal on logout
                this.currentUser.set(null);

                // logout notification
                Swal.fire({
                    title: 'Logged Out',
                    text: 'Come back soon!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    }

    // to get the username from the JWT
    private getUsernameFromToken(): string | null {
        const token = this.getToken();
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.username;
        } catch (e) {
            return null;
        }
    }
}

