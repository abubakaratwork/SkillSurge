import { Injectable } from "@angular/core";
import { LocalAuthService } from "./localauth.service";
import { Category } from "../models/interfaces/Category";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class LocalCategoryService {
    private categoryKey: string = "categories";

    constructor(private authservice: LocalAuthService, private route: Router) { }

    getAll(): Category[] {
        if (!this.checkAuthentication()) return [];

        const item = localStorage.getItem(this.categoryKey);
        let categories: Category[] = item ? JSON.parse(item) : [];

        return categories;
    }

    create(payload: any) {
        if (!this.checkAuthentication()) return;

        let categories: Category[] = this.getAll();

        categories.push(payload);

        localStorage.setItem(this.categoryKey, JSON.stringify(categories));
    }

    getById(id: string): Category | null {
        if (!this.checkAuthentication()) return null;

        let categories: Category[] = this.getAll();

        const category = categories.find(prod => prod.id == id);

        if (category) return category;

        return null;
    }

    // deleteById(id: string) {
    //     let categories: Category[] = this.getAll();

    //     const filteredProducts = categories.filter(prod => prod.id != id);

    //     localStorage.setItem(this.categoryKey, JSON.stringify(filteredProducts));
    // }

    // update(payload: any) {
    //     let categories: Category[] = this.getAll();

    //     const updatedCategory = categories.map(prod => prod.id === payload.id ? { ...prod, ...payload } : prod);

    //     localStorage.setItem(this.categoryKey, JSON.stringify(updatedCategory));
    // }

    private checkAuthentication() {
        if (this.authservice.isLoggedIn()) return true;

        this.route.navigate(['/login']);
        return false;
    }
};