namespace Domain.Entities;

public class Category : AuditableEntity
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public bool IsDeleted { get; set; }
}