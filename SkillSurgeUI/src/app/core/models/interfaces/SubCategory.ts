import { Category } from "./Category";

export interface SubCategory {
    id: string;
    name: string;
    categoryId: string;
    category?: Category;
    description?: string;
    // isActive: boolean;
    createdAt?: Date;
    udpatedAt?: Date;
}