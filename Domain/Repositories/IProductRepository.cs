using Domain.Models.DTOs;

namespace Domain.Repositories;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync(int page, int pageSize);
    Task<Product?> GetByIdAsync(Guid id);
    Task<IEnumerable<Product>> GetByCategoryAsync(Guid categoryId);
    Task<IEnumerable<ProductDetails>> GetByOwnerAsync(Guid ownerId);
    Task<IEnumerable<Product>> SearchAsync(string search);
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task SoftDeleteAsync(Guid id);
}
