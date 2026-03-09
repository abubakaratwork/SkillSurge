import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../services/user.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.userProfile$.pipe(
    map(user => {
      // if user is not logged in, allow access
      if (!user) return true;

      // if logged in, redirect to home
      return router.createUrlTree(['/home']);
    })
  );
};