namespace Domain.Models.Requests.CategoryRequest;

public class CreateCategoryRequest
{
    public string Name { get; set; } = default!;
    public Guid? ParentCategoryId { get; set; }
}