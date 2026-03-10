using Domain.Entities;
using Domain.Models.DTOs;

namespace Services.Abstractions.Services;

public interface IUserService
{
    Task<Result<UserProfile>> GetProfileAsync(Guid userId);
    Task<Result<bool>> UpdateProfileAsync(UpdateUserProfileRequest request, Guid userId);
    Task<Result<bool>> ChangePasswordAsync(ChangePasswordRequest request, Guid userId);
    Task<Result<List<UserDetails>>> GetAllUsersAsync();
    Task<Result<User>> GetUserByIdAsync(Guid id);
    Task<Result<bool>> UpdateUserRoleAsync(Guid id, UpdateUserRoleRequest request);
    Task<Result<bool>> UpdateUserStatusAsync(Guid id, UpdateUserStatusRequest request);
    Task<Result<DashboardDetails>> GetAdminDashboardAsync();
}
