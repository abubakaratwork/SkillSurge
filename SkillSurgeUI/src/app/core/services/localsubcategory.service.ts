import { Injectable } from "@angular/core";
import { LocalAuthService } from "./localauth.service";
import { SubCategory } from "../models/interfaces/SubCategory";
import { Router } from "@angular/router";
import { LocalCategoryService } from "./localcategory.service";
import { ResultService } from "./result.service";
import { ResponseType } from "../models/responses/ResponseType";

@Injectable({
    providedIn: 'root'
})
export class LocalSubCategoryService {
    private subCategoryKey: string = "subCategories";

    constructor(private authService: LocalAuthService, private categoryService: LocalCategoryService, private result: ResultService) { }

    private getStorage(): SubCategory[] {
        const item = localStorage.getItem(this.subCategoryKey);
        return item ? JSON.parse(item) : [];
    }

    private resolveCategory(categoryId: string) {
        const categoryResult = this.categoryService.getById(categoryId);
        return categoryResult.isSuccess ? categoryResult.data ?? undefined : undefined;
    }

    getAll(): ResponseType<SubCategory[]> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<SubCategory[]>("User not authenticated.");

        const subCategories = this.getStorage()
            .map(s => ({
                ...s,
                category: this.resolveCategory(s.categoryId)
            }));

        return this.result.success(subCategories, "Subcategories fetched successfully.");
    }

    create(payload: SubCategory): ResponseType<boolean> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<boolean>("User not authenticated.");

        const subCategories = this.getStorage();

        subCategories.push(payload);

        localStorage.setItem(this.subCategoryKey, JSON.stringify(subCategories));

        return this.result.success(true, "Subcategory created successfully.");
    }

    getById(id: string): ResponseType<SubCategory | null> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<SubCategory | null>("User not authenticated.");

        const subCategories = this.getStorage();

        const subCategory = subCategories.find(s => s.id === id);

        if (!subCategory)
            return this.result.failure<SubCategory | null>("Subcategory not found.");

        const resultSubCategory = {
            ...subCategory,
            category: this.resolveCategory(subCategory.categoryId)
        };

        return this.result.success(resultSubCategory, "Subcategory fetched successfully.");
    }

    getByCurrencyId(categoryId: string): ResponseType<SubCategory[]> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<SubCategory[]>("User not authenticated.");

        let subCategories: SubCategory[] = this.getStorage();

        subCategories = subCategories.filter(s => s.categoryId === categoryId);

        return this.result.success(subCategories, "Subcategory fetched successfully.");
    }

    deleteById(id: string): ResponseType<boolean> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<boolean>("User not authenticated.");

        let subCategories = this.getStorage();

        const exists = subCategories.some(s => s.id === id);

        if (!exists)
            return this.result.failure<boolean>("Subcategory not found.");

        subCategories = subCategories.filter(s => s.id !== id);

        localStorage.setItem(this.subCategoryKey, JSON.stringify(subCategories));

        return this.result.success(true, "Subcategory deleted successfully.");
    }

    update(payload: SubCategory): ResponseType<boolean> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<boolean>("User not authenticated.");

        const subCategories = this.getStorage();

        const exists = subCategories.some(s => s.id === payload.id);

        if (!exists)
            return this.result.failure<boolean>("Subcategory not found.");

        const updated = subCategories.map(s =>
            s.id === payload.id ? { ...s, ...payload } : s
        );

        localStorage.setItem(this.subCategoryKey, JSON.stringify(updated));

        return this.result.success(true, "Subcategory updated successfully.");
    }
};