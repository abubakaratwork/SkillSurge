namespace Domain.Models.DTOs;

public class CategoryDetails
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? ActiveSubCategoriesCount { get; set; }
    public int? DeletedSubCategoriesCount { get; set; }

}
