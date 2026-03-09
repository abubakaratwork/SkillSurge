namespace Domain.Repositories;

public interface IPasswordResetTokenRepository
{
    Task<PasswordResetToken?> GetByTokenAsync(string token);
    Task AddAsync(PasswordResetToken token);
    Task MarkAsUsedAsync(Guid id);
    Task DeleteExpiredTokensAsync();
}
