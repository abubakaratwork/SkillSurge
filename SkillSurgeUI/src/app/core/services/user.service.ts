import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { TypedResponse } from "../models/responses/response.type";
import { BehaviorSubject, catchError, Observable, of, tap } from "rxjs";
import { BaseApiService } from "./base-api.service";
import { AuthService } from "./auth.service";
import { UpdatePasswordRequest, UpdateUserProfileRequest } from "../models/requests/UserRequests";
import { User } from "../models/interfaces/User";

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {

    baseUrl: string = '';
    userUrl: string = '';
    authService = inject(AuthService);

    private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
    public userProfile$ = this.userProfileSubject.asObservable();

    constructor(private client: HttpClient, private config: BaseApiService) {
        this.baseUrl = `${this.config.baseApiUrl}`
        this.userUrl = `${this.baseUrl}/users`
    }

    loadUserProfile(): Observable<UserProfile> {
        if (!this.authService.getAccessToken()) return of(null as any);

        return this.client.get<TypedResponse<UserProfile>>(`${this.baseUrl}/users/profile`).pipe(
            tap(profile => this.userProfileSubject.next(profile.data)),
            catchError(err => {
                console.log(err)
                this.authService.removeAccessToken();
                return of(null as any);
            })
        );
    }

    clearUserState() {
        this.userProfileSubject.next(null);
        this.authService.removeAccessToken();
    }

    logout(): Observable<TypedResponse<boolean>> {
        return this.client.post<TypedResponse<boolean>>(
            `${this.baseUrl}/auth/logout`,
            {},
            { withCredentials: true }
        ).pipe(
            tap(() => this.clearUserState())
        );
    }

    updateUserInfo(payload: UpdateUserProfileRequest): Observable<TypedResponse<boolean>> {
        return this.client.put<TypedResponse<boolean>>(
            `${this.userUrl}/profile`,
            payload
        ).pipe(
            tap(() => this.loadUserProfile().subscribe())
        );
    }

    changePassword(payload: UpdatePasswordRequest): Observable<TypedResponse<boolean>> {
        return this.client.post<TypedResponse<boolean>>(`${this.userUrl}/change-password`, payload)
    }

    getAllUsers(){
        return this.client.get<TypedResponse<User[]>>(`${this.userUrl}`)
    }
};