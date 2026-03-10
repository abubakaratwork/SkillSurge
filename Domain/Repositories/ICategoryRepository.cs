using Domain.Models.DTOs;

namespace Domain.Repositories;

public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllAsync();
    Task<IEnumerable<CategoryDetails>> GetRootCategoriesAsync();
    Task<IEnumerable<SubCategoryDetails>> GetChildrenAsync(Guid parentId);
    Task<IEnumerable<SubCategoryDetails>> GetDeletedChildrenAsync(Guid parentId);
    Task<Category?> GetByIdAsync(Guid id);
    Task<Category?> GetByNameAsync(string name);
    Task AddAsync(Category category);
    Task UpdateAsync(Category category);
    Task SoftDeleteAsync(Guid id, Guid deletedBy);
    Task SoftDeleteCategoryTreeAsync(Guid id, Guid deletedBy);
    Task RestoreAsync(Guid id, Guid restoredBy);
    Task RestoreCategoryTreeAsync(Guid id, Guid restoredBy);
}
