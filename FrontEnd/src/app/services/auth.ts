import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { LoginPayload, RegisterPayload } from "../interfaces/user";
import { Alert } from "./alert";

@Injectable({
    //share global instance to whole app
    providedIn: 'root'
})
export class AuthService {
    // connects angular with http tool, backend endpoint cluster, the JWT and the SweetAlert service
    private http = inject(HttpClient);
    private apiURL = 'http://localhost:3000/api/users';
    private tokenKey = 'shelfbuddy_token';
    private alertService = inject(Alert);


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
        this.alertService.confirm(
            'Are you sure?',
            'You will be logged out of your library session.',
            'Yes, log out!'
        ).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem(this.tokenKey);
                // clears signal on logout
                this.currentUser.set(null);

                // logout notification
                this.alertService.success('Logged Out', 'Come back soon!');
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

