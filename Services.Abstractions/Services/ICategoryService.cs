namespace Services.Abstractions.Services;

public interface ICategoryService
{
    Task<Result<bool>> CreateCategoryAsync(CreateCategoryRequest request);
    Task<Result<bool>> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request);
    Task<Result<bool>> DeleteCategoryAsync(Guid id);
    Task<Result<bool>> GetAllCategoriesAsync();
    Task<Result<bool>> GetCategoryByIdAsync(Guid id);
    Task<Result<bool>> GetCategoryTreeAsync();
    Task<Result<bool>> GetSubCategoriesAsync(Guid parentCategoryId);
}
