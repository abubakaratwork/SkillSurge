namespace Persistence.Repositories;

public class RoleRepository(DbConnectionFactory factory) : IRoleRepository
{
    public async Task<IEnumerable<Role>> GetAllAsync()
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            SELECT *
            FROM Roles
            ORDER BY Level
        
        """;

        return await connection.QueryAsync<Role>(sql);
    }


    public async Task<Role?> GetByIdAsync(Guid id)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            SELECT *
            FROM Roles
            WHERE Id = @Id
        
        """;

        return await connection.QueryFirstOrDefaultAsync<Role>(sql, new { Id = id });
    }


    public async Task<Role?> GetByNameAsync(string name)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            SELECT *
            FROM Roles
            WHERE Name = @Name
        
        """;

        return await connection.QueryFirstOrDefaultAsync<Role>(sql, new { Name = name });
    }


    public async Task<Role> GetDefaultRoleAsync()
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            SELECT *
            FROM Roles
            ORDER BY Level ASC
            LIMIT 1
        
        """;

        return await connection.QuerySingleAsync<Role>(sql);
    }


    public async Task AddAsync(Role role)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            INSERT INTO Roles
            (
                Id,
                Name,
                Level
            )
            VALUES
            (
                @Id,
                @Name,
                @Level
            )
        
        """;

        await connection.ExecuteAsync(sql, role);
    }


    public async Task UpdateAsync(Role role)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            UPDATE Roles
            SET
                Name = @Name,
                Level = @Level
            WHERE Id = @Id
        
        """;

        await connection.ExecuteAsync(sql, role);
    }


    public async Task DeleteAsync(Guid id)
    {
        using var connection = factory.CreateConnection();

        var sql = """
        
            DELETE FROM Roles
            WHERE Id = @Id
        
        """;

        await connection.ExecuteAsync(sql, new { Id = id });
    }
}