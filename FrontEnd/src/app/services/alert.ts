import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class Alert {

    // checking ligth/dark mode from DOM
    private getThemeConfig() {
        // verify if body has a darktheme class on data-bs-theme attibute
        const isDark = 

        // document.documentElement.getAttribute('data-bs-theme') === 'dark'
        //                 ||
        document.body.classList.contains('dark-mode');

        return { 
            background: isDark ? '#212529' : '#fff',
            color: isDark ? '#f8f9fa' : '#212529',
        };
    }

    //Sucess alert
    success(title: string, text?: string): Promise<SweetAlertResult> {
        return Swal.fire({
            title,
            text,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            ...this.getThemeConfig(),
            timerProgressBar: true
        });
    }

    //Error alert
    error(title: string, text?: string): Promise<SweetAlertResult> {
        return Swal.fire({
            title,
            text,
            icon: 'error',
            confirmButtonColor: '#0d6efd'
        });
    }

    // confirmation dialog
    confirm(title: string, text: string): Promise<SweetAlertResult> {
        return Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        });
    }
}
