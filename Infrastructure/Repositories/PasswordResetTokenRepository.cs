namespace Persistence.Repositories;

public class PasswordResetTokenRepository(DbConnectionFactory factory) : IPasswordResetTokenRepository
{
    public async Task<PasswordResetToken?> GetByTokenAsync(string token)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            SELECT *
            FROM PasswordResetTokens
            WHERE Token = @Token
              AND IsUsed = 0
              AND ExpiresAt > @Now
            
            """;

        return await connection.QueryFirstOrDefaultAsync<PasswordResetToken>(sql, new { Token = token, Now = DateTime.UtcNow });
    }

    public async Task AddAsync(PasswordResetToken token)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            INSERT INTO PasswordResetTokens
            (
                Id,
                UserId,
                Token,
                ExpiresAt,
                IsUsed,
                CreatedAt
            )
            VALUES
            (
                @Id,
                @UserId,
                @Token,
                @ExpiresAt,
                @IsUsed,
                @CreatedAt
            )
            
            """;

        await connection.ExecuteAsync(sql, token);
    }

    public async Task MarkAsUsedAsync(Guid id)
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            UPDATE PasswordResetTokens
            SET IsUsed = 1
            WHERE Id = @Id
            
            """;

        await connection.ExecuteAsync(sql, new { Id = id });
    }

    public async Task DeleteExpiredTokensAsync()
    {
        using var connection = factory.CreateConnection();

        var sql = """
            
            DELETE FROM PasswordResetTokens
            WHERE ExpiresAt < @Now
               OR IsUsed = 1
            
            """;

        await connection.ExecuteAsync(sql, new { Now = DateTime.UtcNow });
    }
}