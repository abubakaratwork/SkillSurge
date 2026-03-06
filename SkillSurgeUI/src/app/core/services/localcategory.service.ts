import { Injectable } from "@angular/core";
import { LocalAuthService } from "./localauth.service";
import { Category } from "../models/interfaces/Category";
import { Router } from "@angular/router";
import { SubCategory } from "../models/interfaces/SubCategory";
import { ResponseType } from "../models/responses/ResponseType";
import { ResultService } from "./result.service";

@Injectable({
    providedIn: 'root'
})
export class LocalCategoryService {
    private categoryKey: string = "categories";
    private subCategoryKey: string = "subCategories";

    constructor(private authService: LocalAuthService, private route: Router, private result: ResultService) { }

    private getStorage(): Category[] {
        const item = localStorage.getItem(this.categoryKey);
        return item ? JSON.parse(item) : [];
    }

    getAll(): ResponseType<Category[]> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<Category[]>("User not authenticated.");

        const categories = this.getStorage();

        return this.result.success<Category[]>(categories, "Categories fetched successfully.");
    }

    create(payload: Category): ResponseType<boolean> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<boolean>("User not authenticated.");

        const categories = this.getStorage();

        categories.push(payload);

        localStorage.setItem(this.categoryKey, JSON.stringify(categories));

        return this.result.success(true, "Category created successfully.");
    }

    getById(id: string): ResponseType<Category | null> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<Category | null>("User not authenticated.");

        const categories = this.getStorage();

        const category = categories.find(c => c.id === id);

        if (!category)
            return this.result.failure<Category | null>("Category not found.");

        return this.result.success(category, "Category fetched successfully.");
    }

    deleteById(id: string): ResponseType<boolean> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<boolean>("User not authenticated.");

        let categories = this.getStorage();

        const exists = categories.some(c => c.id === id);

        if (!exists)
            return this.result.failure<boolean>("Category not found.");

        categories = categories.filter(c => c.id !== id);

        localStorage.setItem(this.categoryKey, JSON.stringify(categories));

        this.filterSubcategoriesByCategoryId(id);

        return this.result.success(true, "Category deleted successfully.");
    }

    update(payload: Category): ResponseType<boolean> {

        const user = this.authService.getUserInfo();
        if (!user)
            return this.result.failure<boolean>("User not authenticated.");

        const categories = this.getStorage();

        const exists = categories.some(c => c.id === payload.id);

        if (!exists)
            return this.result.failure<boolean>("Category not found.");

        const updated = categories.map(c =>
            c.id === payload.id ? { ...c, ...payload } : c
        );

        localStorage.setItem(this.categoryKey, JSON.stringify(updated));

        return this.result.success(true, "Category updated successfully.");
    }

    private filterSubcategoriesByCategoryId(categoryId: string) {

        const json = localStorage.getItem(this.subCategoryKey);

        let subCategories: SubCategory[] = json ? JSON.parse(json) : [];

        subCategories = subCategories.filter(s => s.categoryId !== categoryId);

        localStorage.setItem(this.subCategoryKey, JSON.stringify(subCategories));
    }
};