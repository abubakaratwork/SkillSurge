namespace Persistence.Repositories;

public class CategoryRepository(DbConnectionFactory factory) : ICategoryRepository
{
    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            SELECT *
            FROM Categories
            WHERE IsDeleted = FALSE
            ORDER BY Name
            
            """;

        return await connection.QueryAsync<Category>(sql);
    }

    public async Task<IEnumerable<Category>> GetRootCategoriesAsync()
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            SELECT *
            FROM Categories
            WHERE ParentCategoryId IS NULL
              AND IsDeleted = FALSE
            
            """;

        return await connection.QueryAsync<Category>(sql);
    }

    public async Task<IEnumerable<Category>> GetChildrenAsync(Guid parentId)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            SELECT *
            FROM Categories
            WHERE ParentCategoryId = @ParentId
              AND IsDeleted = FALSE
            
            """;

        return await connection.QueryAsync<Category>(sql, new { ParentId = parentId });
    }

    public async Task<Category?> GetByIdAsync(Guid id)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            SELECT *
            FROM Categories
            WHERE Id = @Id
              AND IsDeleted = FALSE
            
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
              AND IsDeleted = FALSE
            
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
              AND IsDeleted = FALSE
            
            """;

        await connection.ExecuteAsync(sql, category);
    }

    public async Task SoftDeleteAsync(Guid id, Guid deletedBy)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            UPDATE Categories
            SET
                IsDeleted = TRUE,
                UpdatedBy = @DeletedBy,
                UpdatedAt = NOW()
            WHERE Id = @Id
            
            """;

        await connection.ExecuteAsync(sql, new
        {
            Id = id,
            DeletedBy = deletedBy
        });
    }
}
