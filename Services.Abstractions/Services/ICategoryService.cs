using Domain.Entities;
using Domain.Models.DTOs;

namespace Services.Abstractions.Services;

public interface ICategoryService
{
    Task<Result<bool>> CreateCategoryAsync(CreateCategoryRequest request);
    Task<Result<bool>> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request);
    Task<Result<bool>> DeleteCategoryAsync(Guid id, Guid userId);
    Task<Result<List<CategoryDetails>>> GetRootCategoriesAsync();
    Task<Result<Category>> GetCategoryByIdAsync(Guid id);
    //Task<Result<bool>> GetCategoryTreeAsync();
    Task<Result<List<SubCategoryDetails>>> GetSubCategoriesAsync(Guid parentCategoryId);
}
