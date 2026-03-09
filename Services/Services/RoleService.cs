
using Domain.Models.Requests.RoleRequests;

namespace Services.Services;

public class RoleService(IRoleRepository roleRepository) : IRoleService
{
    public async Task<Result<List<Role>>> GetAllRolesAsync()
    {
        var roles = await roleRepository.GetAllAsync();
        return Result<List<Role>>.SuccessResult(roles.ToList(), "Roles fetched."); 
    }

    public async Task<Result<Role>> GetRoleByIdAsync(Guid id)
    {
        var role = await roleRepository.GetByIdAsync(id);

        if (role is null)
            return Result<Role>.FailureResult("Role not found.");

        return Result<Role>.SuccessResult(role, $"Role fetched with id: {id}.");
    }

    public async Task<Result<bool>> UpdateRoleAsync(Guid id, UpdateRoleRequest request)
    {
        var role = await roleRepository.GetByIdAsync(id);

        if (role is null)
            return Result<bool>.FailureResult("Role not found.");

        role.Name = request.Name;
        role.Level = request.Level;

        await roleRepository.UpdateAsync(role);

        return Result<bool>.SuccessResult(true, "Role updated successfully.");
    }
}
