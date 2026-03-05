import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // 1. Check if the user is logged in
  // In a real app, you'd use an AuthService here
  const token = localStorage.getItem('token');

  if (token) {
    return true; // Allow access
  } else {
    // 2. Redirect to login if not authenticated
    router.navigate(['/login']);
    return false; // Deny access
  }
};