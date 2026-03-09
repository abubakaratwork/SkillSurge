export interface CreateProductRequest {
    name: string,
    description?: string,
    price: number,
    stockQuantity: number,
    currency: string,
    isActive: boolean,
    categoryId: string,
}

export interface UpdateProductRequest {
    name: string,
    description?: string,
    price: number,
    stockQuantity: number,
    currency: string,
    isActive: boolean,
    categoryId: string,
}
