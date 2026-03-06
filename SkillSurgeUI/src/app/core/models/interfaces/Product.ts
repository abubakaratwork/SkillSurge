import { Category } from "./Category";
import { SubCategory } from "./SubCategory";
import { User } from "./User";

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    stockQuantity: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
    categoryId: string;
    category?: Category;
    subCategoryId: string;
    subCategory?: SubCategory;
    userId: string;
    user?: User;
}
