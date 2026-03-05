import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { LocalAuthService } from "../services/localauth.service";
import { RoleTypes } from "../models/interfaces/User";

export const adminGuard: CanActivateFn = (route, state) => {
    let authService = inject(LocalAuthService);
    let router = inject(Router);

    if (authService.user()?.role == RoleTypes.admin) {
        return true;
    }

    return router.createUrlTree(['/home']);
}