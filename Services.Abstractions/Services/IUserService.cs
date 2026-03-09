using Domain.Entities;

namespace Services.Abstractions.Services;

public interface IUserService
{
    Task<Result<User>> GetProfileAsync(Guid userId);
    Task<Result<bool>> UpdateProfileAsync(UpdateUserProfileRequest request, Guid userId);
    Task<Result<bool>> ChangePasswordAsync(ChangePasswordRequest request, Guid userId);
    Task<Result<List<User>>> GetAllUsersAsync();
    Task<Result<User>> GetUserByIdAsync(Guid id);
    Task<Result<bool>> UpdateUserRoleAsync(Guid id, UpdateUserRoleRequest request);
    Task<Result<bool>> UpdateUserStatusAsync(Guid id, UpdateUserStatusRequest request);
}
