import { Injectable } from "@angular/core";

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    stockQuantity: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class LocalProductService {
    create(payload: any) {
        const item = localStorage.getItem("products");
        let products: Product[] = item ? JSON.parse(item) : [];

        products.push(payload);

        localStorage.setItem("products", JSON.stringify(products));
    }

    getAll(): Product[] {
        const item = localStorage.getItem("products");
        let products: Product[] = item ? JSON.parse(item) : [];

        return products;
    }

    getById(id: string): Product | null {
        const item = localStorage.getItem("products");
        let products: Product[] = item ? JSON.parse(item) : [];

        const product = products.find(prod => prod.id == id);

        if (product) return product;

        return null;
    }

    deleteById(id: string) {
        const item = localStorage.getItem("products");
        let products: Product[] = item ? JSON.parse(item) : [];

        const filteredProducts = products.filter(prod => prod.id != id);

        localStorage.setItem("products", JSON.stringify(filteredProducts));
    }

    update(payload: any) {
        const item = localStorage.getItem("products");
        let products: Product[] = item ? JSON.parse(item) : [];

        const updatedProducts = products.map(prod => prod.id === payload.id ? { ...prod, ...payload } : prod);

        localStorage.setItem("products", JSON.stringify(updatedProducts));
    }
};