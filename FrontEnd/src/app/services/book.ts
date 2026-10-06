import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth';
import { Observable } from 'rxjs';
import { Book } from '../interfaces/book';


@Injectable({
    providedIn: 'root'
})
export class BookService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = 'http://localhost:3000/api/books'; 

    // to attach JWT to all requests
    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`
        });
    }

    // GET, to fetch all books from the logged user
    getBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(this.apiUrl, {headers: this.getHeaders()}); 
    }

    // POST to add a new book
    addBook(book: Partial<Book>): Observable<Book> {
        return this.http.post<Book>(this.apiUrl, book, { headers: this.getHeaders()});
    }

    // PUT, to update an existing book
    updateBook(id: string, book: Partial<Book>): Observable<Book> {
        return this.http.put<Book>(`${this.apiUrl}/${id}`, book, { headers: this.getHeaders()});
    }

    // DELETE a book
    deleteBook(id: string): Observable<{msg: string}> {
        return this.http.delete<{msg: string}>(`${this.apiUrl}/${id}`, {headers: this.getHeaders()});
    }
}
