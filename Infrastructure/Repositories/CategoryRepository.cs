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
                c.Id,
                c.Name,
                c.Description,
                c.IsDeleted,
                c.CreatedAt,
                c.UpdatedAt,
                (
                    SELECT COUNT(Id)
                    FROM Categories
                    WHERE ParentCategoryId = c.Id
                        AND IsDeleted = 0
                ) AS ActiveSubCategoriesCount,
                (
                    SELECT COUNT(Id)
                    FROM Categories
                    WHERE ParentCategoryId = c.Id
                        AND IsDeleted = 1
                ) AS DeletedSubCategoriesCount
                FROM Categories c
                WHERE ParentCategoryId IS NULL
                ORDER BY CreatedAt DESC;
            
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
                s.IsDeleted,
                s.ParentCategoryId,
                s.CreatedAt,
                s.UpdatedAt,
                p.Name AS ParentCategoryName
            FROM Categories AS s
            INNER JOIN Categories AS p
                ON s.ParentCategoryId = p.Id
            WHERE s.ParentCategoryId = @ParentId
            
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
                IsActive,
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
                @IsActive,
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
                IsActive = @IsActive,
                ParentCategoryId = @ParentCategoryId,
                UpdatedBy = @UpdatedBy,
                UpdatedAt = @UpdatedAt
            WHERE Id = @Id
            
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
                UpdatedAt = SYSUTCDATETIME()
            WHERE Id = @Id
        """;

        await connection.ExecuteAsync(sql, new
        {
            Id = id,
            DeletedBy = deletedBy,
            Now = DateTime.UtcNow
        });
    }

    public async Task SoftDeleteCategoryTreeAsync(Guid id, Guid deletedBy)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            WITH CategoryTree AS (
                SELECT Id
                FROM Categories
                WHERE Id = @Id AND IsDeleted = 0

                UNION ALL

                SELECT c.Id
                FROM Categories c
                INNER JOIN CategoryTree ct ON c.ParentCategoryId = ct.Id
                WHERE c.IsDeleted = 0
            )
            UPDATE Categories
            SET 
                IsDeleted = 1,
                UpdatedBy = @DeletedBy,
                UpdatedAt = SYSUTCDATETIME()
            WHERE Id IN (SELECT Id FROM CategoryTree)
        """;

        await connection.ExecuteAsync(sql, new
        {
            Id = id,
            DeletedBy = deletedBy
        });
    }

    public async Task RestoreAsync(Guid id, Guid restoredBy)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            UPDATE Categories
            SET
                IsDeleted = 0,
                UpdatedBy = @RestoredBy,
                UpdatedAt = SYSUTCDATETIME()
            WHERE Id = @Id
        """;

        await connection.ExecuteAsync(sql, new
        {
            Id = id,
            RestoredBy = restoredBy
        });
    }

    public async Task RestoreCategoryTreeAsync(Guid id, Guid restoredBy)
    {
        using var connection = factory.CreateConnection();

        var sql = """
           
            UPDATE Categories
            SET 
                IsDeleted = 0,
                UpdatedBy = @RestoredBy,
                UpdatedAt = SYSUTCDATETIME()
            WHERE (Id = @Id OR ParentCategoryId = @Id) AND IsDeleted = 1

        """;

        await connection.ExecuteAsync(sql, new
        {
            Id = id,
            RestoredBy = restoredBy
        });
    }

    public async Task<IEnumerable<SubCategoryDetails>> GetDeletedChildrenAsync(Guid parentId)
    {
        using var connection = factory.CreateConnection();

        var sql = $"""
            
            SELECT 
                s.Id,
                s.Name,
                s.Description,
                s.IsDeleted,
                s.ParentCategoryId,
                s.CreatedAt,
                s.UpdatedAt,
                p.Name AS ParentCategoryName
            FROM Categories AS s
            INNER JOIN Categories AS p
                ON s.ParentCategoryId = p.Id
            WHERE s.ParentCategoryId = @ParentId
             AND s.IsDeleted = 1
            """;

        return await connection.QueryAsync<SubCategoryDetails>(sql, new { ParentId = parentId });
    }
}
