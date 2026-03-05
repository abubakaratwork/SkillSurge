import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseApiService } from "./base-api.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl: string = '';
  constructor(private client: HttpClient, private config: BaseApiService) {
    this.baseUrl = `${this.config.baseApiUrl}/api/product`;
  }

  createProduct(data: any): Observable<any> {
    return this.client.post(`${this.baseUrl}/create`, data, {
      withCredentials: true
    });
  }

  getAll(): Observable<any> {
    return this.client.get(`${this.baseUrl}/getall`, {
      withCredentials: true
    });
  }

  getById(id: string): Observable<any> {
    return this.client.get(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }

  updateProduct(data: any): Observable<any> {
    return this.client.put(`${this.baseUrl}/${data?.id}`, data, {
      withCredentials: true
    });
  }

  deleteProduct(id: string): Observable<any> {
    return this.client.delete(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }
}