using Domain.Entities;

namespace Services.Abstractions.Services;

public interface IProductService
{
    Task<Result<bool>> CreateProductAsync(CreateProductRequest request);
    Task<Result<bool>> UpdateProductAsync(Guid id, UpdateProductRequest request);
    Task<Result<bool>> DeleteProductAsync(Guid id, Guid userId);
    Task<Result<List<Product>>> GetAllProductsAsync();
    Task<Result<Product>> GetProductByIdAsync(Guid id);
    Task<Result<List<Product>>> GetMyProductsAsync(Guid userId);
}
