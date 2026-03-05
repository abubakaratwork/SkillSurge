import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TypedResponse } from "../models/responses/response.type";
import { Observable } from "rxjs";
import { BaseApiService } from "./base-api.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    baseUrl: string = '';
    constructor(private client: HttpClient, private config: BaseApiService) {
        this.baseUrl = `${this.config.baseApiUrl}/api/auth`
    }

    sum(a: number, b: number) {
        return a + b;
    }

    login(data: any): Observable<TypedResponse<boolean>> {
        return this.client.post<TypedResponse<boolean>>(`${this.baseUrl}/login`, data);
    }

    signup(data: any): Observable<TypedResponse<boolean>> {
        return this.client.post<TypedResponse<boolean>>(`${this.baseUrl}/signup`, data);
    }

    forgotPassword(data: any): Observable<TypedResponse<boolean>> {
        return this.client.post<TypedResponse<boolean>>(`${this.baseUrl}/auth/forgotpassword`, data);
    }

    resetPassword(data: any): Observable<TypedResponse<boolean>> {
        return this.client.post<TypedResponse<boolean>>(`${this.baseUrl}/auth/resetpassword`, data);
    }
};