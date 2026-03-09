import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseApiService } from "./base-api.service";
import { CreateProductRequest, UpdateProductRequest } from "../models/requests/ProductRequests";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl: string = '';
  constructor(private client: HttpClient, private config: BaseApiService) {
    this.baseUrl = `${this.config.baseApiUrl}/products`;
  }

  createProduct(data: CreateProductRequest): Observable<any> {
    return this.client.post(`${this.baseUrl}`, data, {
      withCredentials: true
    });
  }

  getAll(): Observable<any> {
    return this.client.get(`${this.baseUrl}/my`, {
      withCredentials: true
    });
  }

  getById(id: string): Observable<any> {
    return this.client.get(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }

  updateProduct(id: string, data: UpdateProductRequest): Observable<any> {
    return this.client.put(`${this.baseUrl}/${id}`, data, {
      withCredentials: true
    });
  }

  deleteProduct(id: string): Observable<any> {
    return this.client.delete(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }
}