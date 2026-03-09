import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { RoleTypes } from "../models/interfaces/User";
import { map, of, switchMap } from "rxjs";
import { UserService } from "../services/user.service";

export const adminGuard: CanActivateFn = (route, state) => {
    const userService = inject(UserService);
    const router = inject(Router);

    return userService.userProfile$.pipe(
        switchMap(user => {
            if (!user) {
                return userService.loadUserProfile().pipe(
                    map(u => (u?.role.toLowerCase() === RoleTypes.admin.toString())
                        ? true
                        : router.createUrlTree(['/home']))
                );
            }

            return of(user.role.toLowerCase() === RoleTypes.admin.toString()
                ? true
                : router.createUrlTree(['/home']));
        })
    );
};