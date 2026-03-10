using Domain.Models.DTOs;

namespace Persistence.Repositories;

public class ProductRepository(DbConnectionFactory factory) : IProductRepository
{
    public async Task<IEnumerable<Product>> GetAllAsync(int page, int pageSize)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            SELECT *
            FROM Products
            WHERE IsDeleted = 0
            ORDER BY CreatedAt DESC
            OFFSET @Offset ROWS
            FETCH NEXT @PageSize ROWS ONLY;
        
        """;

        return await connection.QueryAsync<Product>(sql, new
        {
            PageSize = pageSize,
            Offset = (page - 1) * pageSize
        });
    }


    public async Task<Product?> GetByIdAsync(Guid id)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            SELECT 
                p.Id, 
                p.Name,
                p.Description,
                p.Price,
                p.StockQuantity,
                p.IsActive,
                p.Currency,
                p.OwnerId,
                p.CreatedAt,
                p.UpdatedAt,
                c.Id AS CategoryId,
                pc.Id AS ParentCategoryId
            FROM Products p
            LEFT JOIN Categories c
                ON p.CategoryId = c.Id
            LEFT JOIN Categories pc
                ON c.ParentCategoryId = pc.Id
            WHERE p.Id = @Id
              AND p.IsDeleted = 0
        """;

        return await connection.QueryFirstOrDefaultAsync<Product>(sql, new { Id = id });
    }


    public async Task<IEnumerable<Product>> GetByCategoryAsync(Guid categoryId)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            SELECT *
            FROM Products
            WHERE CategoryId = @CategoryId
              AND IsDeleted = 0
        
        """;

        return await connection.QueryAsync<Product>(sql, new { CategoryId = categoryId });
    }


    public async Task<IEnumerable<ProductDetails>> GetByOwnerAsync(Guid ownerId)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            SELECT 
                p.Id, 
                p.Name,
                p.Description,
                p.Price,
                p.StockQuantity,
                p.IsActive,
                p.Currency,
                p.CreatedAt,
                p.UpdatedAt,
                c.Name AS CategoryName
            FROM Products p
            LEFT JOIN Categories c
            ON p.CategoryId = c.Id
            WHERE p.OwnerId = @OwnerId
              AND p.IsDeleted = 0
        
        """;

        return await connection.QueryAsync<ProductDetails>(sql, new { OwnerId = ownerId });
    }


    public async Task<IEnumerable<Product>> SearchAsync(string search)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            SELECT *
            FROM Products
            WHERE IsDeleted = 0
              AND LOWER(Name) LIKE LOWER(@Search)
        
        """;

        return await connection.QueryAsync<Product>(sql, new
        {
            Search = $"%{search}%"
        });
    }


    public async Task AddAsync(Product product)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            INSERT INTO Products
            (
                Id,
                Name,
                Description,
                Price,
                StockQuantity,
                IsActive,
                Currency,
                CategoryId,
                OwnerId,
                IsDeleted,
                CreatedAt
            )
            VALUES
            (
                @Id,
                @Name,
                @Description,
                @Price,
                @StockQuantity,
                @IsActive,
                @Currency,
                @CategoryId,
                @OwnerId,
                @IsDeleted,
                @CreatedAt
            )
        
        """;

        await connection.ExecuteAsync(sql, product);
    }


    public async Task UpdateAsync(Product product)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            UPDATE Products
            SET
                Name = @Name,
                Description = @Description,
                Price = @Price,
                StockQuantity = @StockQuantity,
                IsActive = @IsActive,
                Currency = @Currency,
                CategoryId = @CategoryId,
                UpdatedAt = @UpdatedAt
            WHERE Id = @Id
              AND IsDeleted = 0
        
        """;

        await connection.ExecuteAsync(sql, product);
    }


    public async Task SoftDeleteAsync(Guid id)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            UPDATE Products
            SET IsDeleted = 1,
                UpdatedAt = @Now
            WHERE Id = @Id
        
        """;

        await connection.ExecuteAsync(sql, new { Id = id, Now = DateTime.UtcNow });
    }
}
