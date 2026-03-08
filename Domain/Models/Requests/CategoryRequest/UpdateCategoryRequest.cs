namespace Domain.Models.Requests.CategoryRequest;

public class UpdateCategoryRequest
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public Guid UserId { get; set; }
}