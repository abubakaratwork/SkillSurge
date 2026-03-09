using Domain.Entities;
using Domain.Models.Requests.RoleRequests;

namespace Services.Abstractions.Services;

public interface IRoleService
{
    Task<Result<List<Role>>> GetAllRolesAsync();
    Task<Result<Role>> GetRoleByIdAsync(Guid id);
    Task<Result<bool>> UpdateRoleAsync(Guid id, UpdateRoleRequest request);
}
