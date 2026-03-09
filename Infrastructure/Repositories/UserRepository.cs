namespace Persistence.Repositories;

public class UserRepository(DbConnectionFactory factory) : IUserRepository
{
    public async Task<IEnumerable<User>> GetAllAsync(int page, int pageSize)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            SELECT *
            FROM Users
            ORDER BY CreatedAt DESC
            OFFSET @Offset ROWS
            FETCH NEXT @PageSize ROWS ONLY
        
        """;

        return await connection.QueryAsync<User>(sql, new
        {
            PageSize = pageSize,
            Offset = (page - 1) * pageSize
        });
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            SELECT *
            FROM Users
            WHERE Id = @Id
        
        """;

        return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Id = id });
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            SELECT *
            FROM Users
            WHERE Email = @Email
        
        """;

        return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Email = email });
    }

    public async Task AddAsync(User user)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            INSERT INTO Users
            (
                Id,
                FirstName,
                LastName,
                Email,
                PasswordHash,
                RoleId,
                IsActive,
                CreatedAt
            )
            VALUES
            (
                @Id,
                @FirstName,
                @LastName,
                @Email,
                @PasswordHash,
                @RoleId,
                @IsActive,
                @CreatedAt
            )
        
        """;

        await connection.ExecuteAsync(sql, user);
    }

    public async Task UpdateAsync(User user)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            UPDATE Users
            SET
                FirstName = @FirstName,
                LastName = @LastName,
                UpdatedAt = @UpdatedAt
            WHERE Id = @Id
        
        """;

        await connection.ExecuteAsync(sql, user);
    }

    public async Task UpdatePasswordAsync(Guid userId, string passwordHash)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            UPDATE Users
            SET
                PasswordHash = @PasswordHash,
                UpdatedAt = @Now
            WHERE Id = @UserId
        
        """;

        await connection.ExecuteAsync(sql, new
        {
            UserId = userId,
            PasswordHash = passwordHash,
            Now = DateTime.UtcNow
        });
    }

    public async Task UpdateRoleAsync(Guid userId, Guid roleId)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            UPDATE Users
            SET
                RoleId = @RoleId,
                UpdatedAt = @Now
            WHERE Id = @UserId
        
        """;

        await connection.ExecuteAsync(sql, new
        {
            UserId = userId,
            RoleId = roleId,
            Now = DateTime.UtcNow
        });
    }

    public async Task UpdateLastLoginAsync(Guid userId)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            UPDATE Users
            SET LastLoginAt = @Now
            WHERE Id = @UserId
        
        """;

        await connection.ExecuteAsync(sql, new { UserId = userId, Now = DateTime.UtcNow });
    }

    public async Task ActivateAsync(Guid userId)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            UPDATE Users
            SET IsActive = 1,
                UpdatedAt = @Now
            WHERE Id = @UserId
        
        """;

        await connection.ExecuteAsync(sql, new { UserId = userId, Now = DateTime.UtcNow });
    }

    public async Task DeactivateAsync(Guid userId)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            UPDATE Users
            SET IsActive = 0,
                UpdatedAt = @Now
            WHERE Id = @UserId
        
        """;

        await connection.ExecuteAsync(sql, new { UserId = userId, Now = DateTime.UtcNow });
    }


    public async Task DeleteAsync(Guid userId)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            DELETE FROM Users
            WHERE Id = @UserId
        
        """;

        await connection.ExecuteAsync(sql, new { UserId = userId });
    }
}