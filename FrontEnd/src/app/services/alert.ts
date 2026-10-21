import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class Alert {

    // checking ligth/dark mode from DOM
    private getThemeConfig() {
        // verify if body has a darktheme class on data-bs-theme attibute
        const isDark = document.body.classList.contains('dark-mode');

        return { 
            background: isDark ? 'linear-gradient(300deg, #27215a, #6e5205)' : 'linear-gradient(300deg, #f8e5b5, #b0f3d6)',
            color: isDark ? '#6c757d' : '#212529',
        };
    }

    //Sucess alert
    success(title: string, text?: string): Promise<SweetAlertResult> {
        const theme = this.getThemeConfig();
        return Swal.fire({
            title,
            text,
            position: 'top-end',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
            ...theme,
            timerProgressBar: true
        });
    }

    //Error alert
    error(title: string, text?: string): Promise<SweetAlertResult> {
        const theme = this.getThemeConfig();
        return Swal.fire({
            title,
            text,
            icon: 'error',
            confirmButtonColor: '#0d6efd',
            ...theme
        });
    }

    // confirmation dialog
    confirm(title: string, text: string, confirmButtonText = 'Yes, delete it!'): Promise<SweetAlertResult> {
        const theme = this.getThemeConfig();
        return Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText,
            cancelButtonText: 'Cancel',
            ...theme
        });
    }
}
