import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { TypedResponse } from "../models/responses/response.type";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private client = inject(HttpClient); 
    private baseUrl = "https://localhost:7121/auth"

    sum(a : number, b: number){
        return a + b;
    }

    login(data: any) : Observable<TypedResponse<boolean>> {
        return this.client.post<TypedResponse<boolean>>(`${this.baseUrl}/login`, data);
    }

    signup(data: any) : Observable<TypedResponse<boolean>> {
        return this.client.post<TypedResponse<boolean>>(`${this.baseUrl}/signup`, data);
    }

    forgotPassword(data: any) : Observable<TypedResponse<boolean>> {
        return this.client.post<TypedResponse<boolean>>(`${this.baseUrl}/forgotpassword`, data);
    }

    resetPassword(data: any) : Observable<TypedResponse<boolean>> {
        return this.client.post<TypedResponse<boolean>>(`${this.baseUrl}/resetpassword`, data);
    }
};