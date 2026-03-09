import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

   return userService.userProfile$.pipe(
    switchMap(profile => {
      if (profile) return of(true);
      return userService.loadUserProfile().pipe(
        map(p => p ? true : router.createUrlTree(['/login']))
      );
    }),
  );
};