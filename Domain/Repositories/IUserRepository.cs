using Domain.Models.DTOs;

namespace Domain.Repositories;

public interface IUserRepository
{
    Task<IEnumerable<UserDetails>> GetAllAsync(int page, int pageSize);
    Task<UserProfile?> GetProfileByIdAsync(Guid id);
    Task<User> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
    Task AddAsync(User user);
    Task UpdateAsync(User user);
    Task UpdatePasswordAsync(Guid userId, string passwordHash);
    Task UpdateRoleAsync(Guid userId, Guid roleId);
    Task UpdateLastLoginAsync(Guid userId);
    Task ActivateAsync(Guid userId);
    Task DeactivateAsync(Guid userId);
    Task DeleteAsync(Guid userId);
}
