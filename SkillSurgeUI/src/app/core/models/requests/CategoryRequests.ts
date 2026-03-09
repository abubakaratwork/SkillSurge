export interface CreateCategoryRequest{
    name: string,
    description?: string,
    isActive: boolean,
    parentCategoryId?: string,
}

export interface UpdateCategoryRequest{
    name: string,
    description?: string,
    isActive: boolean,
    parentCategoryId?: string,
}
