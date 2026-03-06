import { Injectable } from "@angular/core";
import { Product } from "../models/interfaces/Product";
import { LocalAuthService } from "./localauth.service";
import { Router } from "@angular/router";
import { LocalCategoryService } from "./localcategory.service";
import { ResponseType } from "../models/responses/ResponseType";
import { ResultService } from "./result.service";
import { LocalSubCategoryService } from "./localsubcategory.service";

@Injectable({
    providedIn: 'root'
})
export class LocalProductService {
    private productKey: string = "products";

    constructor(private authService: LocalAuthService, private categoryService: LocalCategoryService, private subCategoryService: LocalSubCategoryService, private route: Router, private result: ResultService) { }

    private getAll(): Product[] {
        const item = localStorage.getItem(this.productKey);
        let products: Product[] = item ? JSON.parse(item) : [];

        return products;
    }

    getAllByUser(): ResponseType<Product[]> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<Product[]>("User not authenticated.");

        let products = this.getAll()
            .filter(p => p.userId === user.id)
            .map(p => {
                const categoryResult = this.categoryService.getById(p.categoryId);
                const subCategoryResult = this.subCategoryService.getById(p.subCategoryId);
                return {
                    ...p,
                    category: categoryResult.data ?? undefined,
                    subCategory: subCategoryResult.data ?? undefined
                }
            });

        return this.result.success<Product[]>(products, "Products fetched successfully.");
    }

    create(payload: Product): ResponseType<boolean> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<boolean>("User not authenticated.");

        const products = this.getAll();

        products.push({
            ...payload,
            userId: user.id
        });

        localStorage.setItem(this.productKey, JSON.stringify(products));

        return this.result.success(true, "Product created successfully.");
    }

    getById(id: string): ResponseType<Product | null> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<Product | null>("User not authenticated.");

        const product = this.getAll().find(p => p.id === id);

        if (!product)
            return this.result.failure<Product | null>("Product not found.");

        const categoryResult = this.categoryService.getById(product.categoryId);
        const subSategoryResult = this.subCategoryService.getById(product.subCategoryId);
        const resultProduct: Product = {
            ...product,
            category: categoryResult.data ?? undefined,
            subCategory: subSategoryResult.data ?? undefined
        };

        return this.result.success<Product | null>(resultProduct, "Product fetched successfully.");
    }

    deleteById(id: string): ResponseType<boolean> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<boolean>("User not authenticated.");

        const products = this.getAll();
        const filteredProducts = products.filter(p => p.id !== id);

        localStorage.setItem(this.productKey, JSON.stringify(filteredProducts));

        return this.result.success(true, "Product deleted successfully.");
    }

    update(payload: Product): ResponseType<boolean> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<boolean>("User not authenticated.");

        const products = this.getAll();

        const updatedProducts = products.map(p =>
            p.id === payload.id ? { ...p, ...payload } : p
        );

        localStorage.setItem(this.productKey, JSON.stringify(updatedProducts));

        return this.result.success(true, "Product updated successfully.");
    }
};