using Domain.Models.DTOs;

namespace Services.Services;

public class CategoryService(
    ICategoryRepository categoryRepository,
    IValidator<CreateCategoryRequest> createValidator,
    IValidator<UpdateCategoryRequest> updateValidator
) : ICategoryService
{
    public async Task<Result<bool>> CreateCategoryAsync(CreateCategoryRequest request)
    {
        var validationResult = await createValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new ValidationException(validationResult.Errors);

        var existing = await categoryRepository.GetByNameAsync(request.Name);
        if (existing != null)
            return Result<bool>.FailureResult("Category with this name already exists");

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Description = request.Description,
            ParentCategoryId = request.ParentCategoryId,
            IsDeleted = false,
            CreatedBy = request.UserId,
            CreatedAt = DateTime.UtcNow
        };

        await categoryRepository.AddAsync(category);
        return Result<bool>.SuccessResult(true, "Category created successfully.");
    }

    public async Task<Result<List<CategoryDetails>>> GetRootCategoriesAsync()
    {
        var categories = await categoryRepository.GetRootCategoriesAsync();

        return categories.Any()
            ? Result<List<CategoryDetails>>.SuccessResult(categories.ToList(), "Categories fetched successfully.")
            : Result<List<CategoryDetails>>.FailureResult("No categories found");
    }

    public async Task<Result<Category>> GetCategoryByIdAsync(Guid id)
    {
        var category = await categoryRepository.GetByIdAsync(id);

        return category != null
            ? Result<Category>.SuccessResult(category, "Category found.")
            : Result<Category>.FailureResult("Category not found");
    }

    //public async Task<Result<bool>> GetCategoryTreeAsync()
    //{
    //    var roots = await categoryRepository.GetRootCategoriesAsync();
    //    var result = new List<Category>();

    //    foreach (var root in roots)
    //    {
    //        result.Add(root);
    //        await AddChildrenRecursive(root, result);
    //    }

    //    return Result.Success(true);
    //}

    //private async Task AddChildrenRecursive(Category parent, List<Category> list)
    //{
    //    var children = await categoryRepository.GetChildrenAsync(parent.Id);
    //    foreach (var child in children)
    //    {
    //        list.Add(child);
    //        await AddChildrenRecursive(child, list);
    //    }
    //}

    public async Task<Result<List<SubCategoryDetails>>> GetSubCategoriesAsync(Guid parentCategoryId)
    {
        var children = await categoryRepository.GetChildrenAsync(parentCategoryId);
        return children.Any()
            ? Result<List<SubCategoryDetails>>.SuccessResult(children.ToList(), "")
            : Result<List<SubCategoryDetails>>.FailureResult("No subcategories found");
    }

    public async Task<Result<bool>> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request)
    {
        var validationResult = await updateValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new ValidationException(validationResult.Errors);

        var category = await categoryRepository.GetByIdAsync(id);
        if (category == null)
            return Result<bool>.FailureResult("Category not found");

        category.Name = request.Name.Trim();
        category.Description = request.Description;
        category.ParentCategoryId = request.ParentCategoryId;
        category.UpdatedBy = request.UserId;
        category.UpdatedAt = DateTime.UtcNow;

        await categoryRepository.UpdateAsync(category);
        return Result<bool>.SuccessResult(true, "Category updated successfully.");
    }

    public async Task<Result<bool>> DeleteCategoryAsync(Guid id, Guid userId)
    {
        var category = await categoryRepository.GetByIdAsync(id);
        if (category == null)
            return Result<bool>.FailureResult("Category not found");

        await categoryRepository.SoftDeleteAsync(id, userId);
        return Result<bool>.SuccessResult(true, "Category deleted successfully.");
    }
}
