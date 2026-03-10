export interface Category {
    id: string;
    name: string;
    description?: string;
    isDeleted: boolean;
    parentCategoryId?: string,
    createdAt?: Date;
    updatedAt?: Date;
    activeSubCategories?: Category[];
    deletedSubCategories?: Category[];
    activeSubCategoriesCount?: number;
    deletedSubCategoriesCount?: number;
    isActiveExpanded?: boolean;
    isDeletedExpanded?: boolean;
}