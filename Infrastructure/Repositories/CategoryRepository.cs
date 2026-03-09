using Domain.Models.DTOs;

namespace Persistence.Repositories;

public class CategoryRepository(DbConnectionFactory factory) : ICategoryRepository
{
    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            SELECT *
            FROM Categories
            WHERE IsDeleted = 0
            ORDER BY Name
            
            """;

        return await connection.QueryAsync<Category>(sql);
    }

    public async Task<IEnumerable<CategoryDetails>> GetRootCategoriesAsync()
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            SELECT 
              Id,
              Name,
              Description,
              CreatedAt,
              UpdatedAt
            FROM Categories
            WHERE ParentCategoryId IS NULL
              AND IsDeleted = 0
            
            """;

        return await connection.QueryAsync<CategoryDetails>(sql);
    }

    public async Task<IEnumerable<SubCategoryDetails>> GetChildrenAsync(Guid parentId)
    {
        using var connection = factory.CreateConnection();

        var sql = $"""
            
            SELECT 
                s.Id,
                s.Name,
                s.Description,
                s.ParentCategoryId,
                s.CreatedAt,
                s.UpdatedAt,
                p.Name AS ParentCategoryName
            FROM Categories AS s
            INNER JOIN Categories AS p
                ON s.ParentCategoryId = p.Id
            WHERE s.ParentCategoryId = @ParentId
              AND s.IsDeleted = 0
            
            """;

        return await connection.QueryAsync<SubCategoryDetails>(sql, new { ParentId = parentId });
    }

    public async Task<Category?> GetByIdAsync(Guid id)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            SELECT *
            FROM Categories
            WHERE Id = @Id
              AND IsDeleted = 0
            
            """;

        return await connection.QueryFirstOrDefaultAsync<Category>(sql, new { Id = id });
    }

    public async Task<Category?> GetByNameAsync(string name)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            SELECT *
            FROM Categories
            WHERE Name = @Name
              AND IsDeleted = 0
            
            """;

        return await connection.QueryFirstOrDefaultAsync<Category>(sql, new { Name = name });
    }


    public async Task AddAsync(Category category)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            INSERT INTO Categories
            (
                Id,
                Name,
                Description,
                ParentCategoryId,
                IsDeleted,
                CreatedBy,
                CreatedAt
            )
            VALUES
            (
                @Id,
                @Name,
                @Description,
                @ParentCategoryId,
                @IsDeleted,
                @CreatedBy,
                @CreatedAt
            )
            
            """;

        await connection.ExecuteAsync(sql, category);
    }

    public async Task UpdateAsync(Category category)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            UPDATE Categories
            SET
                Name = @Name,
                Description = @Description,
                ParentCategoryId = @ParentCategoryId,
                UpdatedBy = @UpdatedBy,
                UpdatedAt = @UpdatedAt
            WHERE Id = @Id
              AND IsDeleted = 0
            
            """;

        await connection.ExecuteAsync(sql, category);
    }

    public async Task SoftDeleteAsync(Guid id, Guid deletedBy)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            UPDATE Categories
            SET
                IsDeleted = 1,
                UpdatedBy = @DeletedBy,
                UpdatedAt = @Now
            WHERE Id = @Id
            
            """;

        await connection.ExecuteAsync(sql, new
        {
            Id = id,
            DeletedBy = deletedBy,
            Now = DateTime.UtcNow
        });
    }
}
