import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalAuthService } from '../services/localauth.service';

export const guestGuard: CanActivateFn = (route, state) => {

  const authService = inject(LocalAuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/home']);
};