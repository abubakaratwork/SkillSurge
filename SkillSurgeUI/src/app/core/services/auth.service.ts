import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TypedResponse } from "../models/responses/response.type";
import { BehaviorSubject, catchError, Observable, of, tap } from "rxjs";
import { BaseApiService } from "./base-api.service";
import { LoginRequest, SignupRequest } from "../models/requests/AuthRequests";
import { LoginResponse } from "../models/responses/AuthResponses";
import { UserService } from "./user.service";

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
export class AuthService {

    baseUrl: string = '';
    authUrl: string = '';

    constructor(private client: HttpClient, private config: BaseApiService) {
        this.baseUrl = `${this.config.baseApiUrl}`
        this.authUrl = `${this.baseUrl}/auth`
    }

    login(data: LoginRequest): Observable<TypedResponse<LoginResponse>> {
        return this.client.post<TypedResponse<LoginResponse>>(`${this.authUrl}/login`, data, { withCredentials: true });
    }

    signup(data: SignupRequest): Observable<TypedResponse<boolean>> {
        return this.client.post<TypedResponse<boolean>>(`${this.authUrl}/signup`, data);
    }

    forgotPassword(data: any): Observable<TypedResponse<boolean>> {
        return this.client.post<TypedResponse<boolean>>(`${this.authUrl}/auth/forgotPassword`, data);
    }

    resetPassword(data: any): Observable<TypedResponse<boolean>> {
        return this.client.post<TypedResponse<boolean>>(`${this.authUrl}/auth/resetPassword`, data);
    }

    refreshToken() {
        return this.client.post<{ accessToken: string }>(`${this.authUrl}/refreshToken`, {}, { withCredentials: true });
    }

    setAccessToken(token: string) { localStorage.setItem('access_token', token); }
    getAccessToken(): string | null { return localStorage.getItem('access_token'); }
    removeAccessToken() { localStorage.removeItem('access_token'); }
};