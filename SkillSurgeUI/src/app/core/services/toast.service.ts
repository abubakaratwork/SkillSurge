import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Injectable({
    providedIn: 'root',
})
export class ToastService {

    constructor(private snackBar: MatSnackBar) { }

    show(message: string, type: ToastType = 'info', duration: number = 3000) {

        const icons = {
            success: '✔',
            error: '✖',
            info: 'ℹ',
            warning: '⚠'
        };

        this.snackBar.open(`${icons[type]}  ${message}`, '✖', {
            duration,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['toast', `toast-${type}`],
        });
    }

    success(message: string, duration?: number) {
        this.show(message, 'success', duration);
    }

    error(message: string, duration?: number) {
        this.show(message, 'error', duration);
    }

    info(message: string, duration?: number) {
        this.show(message, 'info', duration);
    }

    warning(message: string, duration?: number) {
        this.show(message, 'warning', duration);
    }
}