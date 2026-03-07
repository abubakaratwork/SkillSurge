namespace Persistence.Repositories;

public class RefreshTokenRepository(DbConnectionFactory factory) : IRefreshTokenRepository
{
    public async Task<RefreshToken?> GetByTokenAsync(string token)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            SELECT * FROM RefreshTokens
            WHERE Token = @Token AND IsRevoked = 0
            
            """;

        return await connection.QueryFirstOrDefaultAsync<RefreshToken>(sql, new { Token = token });
    }

    public async Task<IEnumerable<RefreshToken>> GetByUserIdAsync(Guid userId)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            SELECT * FROM RefreshTokens
            WHERE UserId = @UserId AND IsRevoked = 0

            """;

        return await connection.QueryAsync<RefreshToken>(sql, new { UserId = userId });
    }

    public async Task AddAsync(RefreshToken token)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            INSERT INTO RefreshTokens 
            (
                Id,
                Token,
                UserId,
                ExpiryDate,
                IsRevoked,
                CreatedAt
            )
            VALUES
            (
                @Id,
                @Token,
                @UserId,
                @ExpiryDate,
                @IsRevoked,
                @CreatedAt
            )
            
            """;

        await connection.ExecuteAsync(sql, token);
    }

    public async Task RevokeAsync(Guid tokenId)
    {
        using var connection = factory.CreateConnection();

        var sql = """

            UPDATE RefreshTokens 
            SET IsRevoked = 1
            WHERE Id = @Id
            
            """;

        await connection.ExecuteAsync(sql, new { Id = tokenId });
    }

    public async Task DeleteExpiredTokensAsync()
    {
        using var connection = factory.CreateConnection();

        var sql = """

            DELETE FROM RefreshTokens
            WHERE ExpiryDate < @Now OR IsRevoked = 1
            
            """;

        await connection.ExecuteAsync(sql, new { Now = DateTime.UtcNow });
    }
}
