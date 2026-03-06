import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { LocalAuthService } from "../services/localauth.service";
import { RoleTypes } from "../models/interfaces/User";
import { map } from "rxjs";

export const adminGuard: CanActivateFn = (route, state) => {
    let authService = inject(LocalAuthService);
    let router = inject(Router);

    return authService.user$.pipe(
        map(user => {
            if (user?.role === RoleTypes.admin) {
                return true;
            }
            return router.createUrlTree(['/home']);
        })
    );
}