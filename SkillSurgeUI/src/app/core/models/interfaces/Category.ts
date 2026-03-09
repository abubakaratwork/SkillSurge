export interface Category {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    parentCategoryId?: string,
    createdAt?: Date;
    updatedAt?: Date;
    subCategories?: Category[];
    subCategoriesCount?: number;
    isExpanded?: boolean;
}