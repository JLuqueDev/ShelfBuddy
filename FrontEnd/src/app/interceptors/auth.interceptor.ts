import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = ( req, next ) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    // to clone the request and add the auth header if token exists
    let clonedReq = req;
    if (token) {
        clonedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    // handle the req and catch a 401 unauth error
    return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                console.warn('Unauthorized request or expired token. Logging out...');
            }
            return throwError(() => error);
        })
    );
}