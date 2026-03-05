import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

  private baseUrl = "https://localhost:7121/api/product";

  constructor(private client: HttpClient) {}

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