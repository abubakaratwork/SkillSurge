namespace Persistence.Repositories;

public class ProductRepository(DbConnectionFactory factory) : IProductRepository
{
    public async Task<IEnumerable<Product>> GetAllAsync(int page, int pageSize)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            SELECT *
            FROM Products
            WHERE IsDeleted = FALSE
            ORDER BY CreatedAt DESC
            LIMIT @PageSize
            OFFSET @Offset
        
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
        
            SELECT *
            FROM Products
            WHERE Id = @Id
              AND IsDeleted = FALSE
        
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
              AND IsDeleted = FALSE
        
        """;

        return await connection.QueryAsync<Product>(sql, new { CategoryId = categoryId });
    }


    public async Task<IEnumerable<Product>> GetByOwnerAsync(Guid ownerId)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            SELECT *
            FROM Products
            WHERE OwnerId = @OwnerId
              AND IsDeleted = FALSE
        
        """;

        return await connection.QueryAsync<Product>(sql, new { OwnerId = ownerId });
    }


    public async Task<IEnumerable<Product>> SearchAsync(string search)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            SELECT *
            FROM Products
            WHERE IsDeleted = FALSE
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
                CategoryId = @CategoryId,
                UpdatedAt = @UpdatedAt
            WHERE Id = @Id
              AND IsDeleted = FALSE
        
        """;

        await connection.ExecuteAsync(sql, product);
    }


    public async Task SoftDeleteAsync(Guid id)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            UPDATE Products
            SET IsDeleted = TRUE,
                UpdatedAt = NOW()
            WHERE Id = @Id
        
        """;

        await connection.ExecuteAsync(sql, new { Id = id });
    }
}
