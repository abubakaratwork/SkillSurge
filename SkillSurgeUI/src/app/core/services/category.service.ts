import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseApiService } from "./base-api.service";
import { CreateCategoryRequest, UpdateCategoryRequest } from "../models/requests/CategoryRequests";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseUrl: string = '';
  constructor(private client: HttpClient, private config: BaseApiService) {
    this.baseUrl = `${this.config.baseApiUrl}/categories`;
  }

  createCategory(data: CreateCategoryRequest): Observable<any> {
    return this.client.post(`${this.baseUrl}`, data, {
      withCredentials: true
    });
  }

  getAll(): Observable<any> {
    return this.client.get(`${this.baseUrl}`, {
      withCredentials: true
    });
  }

  getSubCategories(parentId: string): Observable<any> {
    return this.client.get(`${this.baseUrl}/${parentId}/subcategories`, {
      withCredentials: true
    });
  }

  getById(id: string): Observable<any> {
    return this.client.get(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }

  updateCategory(id: string, data: UpdateCategoryRequest): Observable<any> {
    return this.client.put(`${this.baseUrl}/${id}`, data, {
      withCredentials: true
    });
  }

  deleteCategory(id: string): Observable<any> {
    return this.client.delete(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }
}