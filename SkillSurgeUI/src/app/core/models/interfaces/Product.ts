import { Category } from "./Category";
import { User } from "./User";

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    stockQuantity: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
    categoryId: string;
    category?: Category;
    userId: string;
    user?: User;
}
