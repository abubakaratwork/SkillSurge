namespace Domain.Models.DTOs;

public class ProductDetails
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; }
    public string Currency { get; set; } = default!;
    public string CategoryName { get; set; } = default!;
    public string SubCategoryName { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
