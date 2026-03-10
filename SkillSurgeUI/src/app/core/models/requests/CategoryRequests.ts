export interface CreateCategoryRequest{
    name: string,
    description?: string,
    parentCategoryId?: string,
}

export interface UpdateCategoryRequest{
    name: string,
    description?: string,
    parentCategoryId?: string,
}
