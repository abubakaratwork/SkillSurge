namespace Domain.Models.Requests.CategoryRequest;

public class UpdateCategoryRequest
{
    public string Name { get; set; } = default!;
    public Guid? ParentCategoryId { get; set; }
}