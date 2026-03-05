import { Injectable } from "@angular/core";
import { Product } from "../models/interfaces/Product";
import { LocalAuthService } from "./localauth.service";
import { Router } from "@angular/router";
import { LocalCategoryService } from "./localcategory.service";

@Injectable({
    providedIn: 'root'
})
export class LocalProductService {
    private productKey: string = "products";

    constructor(private authservice: LocalAuthService, private categoryService: LocalCategoryService, private route: Router) { }

    private getAll(): Product[] {
        const item = localStorage.getItem(this.productKey);
        let products: Product[] = item ? JSON.parse(item) : [];

        return products;
    }

    getAllByUser(): Product[] | null {
        if (!this.checkAuthentication()) return null;
        
        let products: Product[] = this.getAll();
        products = products.filter(p => p.userId == this.authservice.user()?.id)
        products = products.map(p => ({ ...p, category: this.categoryService.getById(p.categoryId) ?? undefined }))
        return products
    }

    create(payload: any) {
        if (!this.checkAuthentication()) return;

        let products: Product[] = this.getAll();
        products.push(payload);
        localStorage.setItem(this.productKey, JSON.stringify(products));
    }

    getById(id: string): Product | null {
        if (!this.checkAuthentication()) return null;
        
        let products: Product[] = this.getAll();
        const product = products.find(prod => prod.id == id);
        if (product) return { ...product, category: this.categoryService.getById(product.categoryId) ?? undefined };
        return null;
    }

    deleteById(id: string) {
        if (!this.checkAuthentication()) return;

        let products: Product[] = this.getAll();
        const filteredProducts = products.filter(prod => prod.id != id);
        localStorage.setItem(this.productKey, JSON.stringify(filteredProducts));
    }

    update(payload: any) {
        if (!this.checkAuthentication()) return;

        let products: Product[] = this.getAll();
        const updatedProducts = products.map(prod => prod.id === payload.id ? { ...prod, ...payload } : prod);
        localStorage.setItem(this.productKey, JSON.stringify(updatedProducts));
    }

    private checkAuthentication() {
        if (this.authservice.isLoggedIn()) return true;

        this.route.navigate(['/login']);
        return false;
    }
};