using Domain.Models.DTOs;

namespace Services.Services;

public class UserService(
    IUserRepository userRepository,
    IRoleRepository roleRepository,
    PasswordHashHandler passwordHasher,
    IValidator<ChangePasswordRequest> changePasswordValidator,
    IValidator<UpdateUserProfileRequest> updateProfileValidator,
    IValidator<UpdateUserRoleRequest> updateRoleValidator,
    IValidator<UpdateUserStatusRequest> updateStatusValidator
) : IUserService
{
    public async Task<Result<bool>> ChangePasswordAsync(ChangePasswordRequest request, Guid userId)
    {
        var validationResult = await changePasswordValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new ValidationException(validationResult.Errors);

        var user = await userRepository.GetByIdAsync(userId);
        if (user == null)
            return Result<bool>.FailureResult("User not found");

        if (!passwordHasher.VerifyPassword(request.CurrentPassword, user.PasswordHash))
            return Result<bool>.FailureResult("Old password is incorrect");

        var newHash = passwordHasher.HashPassword(request.NewPassword);
        await userRepository.UpdatePasswordAsync(user.Id, newHash);

        return Result<bool>.SuccessResult(true, "Password updated successfully.");
    }

    public async Task<Result<DashboardDetails>> GetAdminDashboardAsync()
    {
        var result = await userRepository.GetDashboardDetailsAsync();
        return Result<DashboardDetails>.SuccessResult(result, "Dashboard data fetched");
    }

    public async Task<Result<List<UserDetails>>> GetAllUsersAsync()
    {
        var users = await userRepository.GetAllAsync(1, 100);
        return users.Any()
            ? Result<List<UserDetails>>.SuccessResult(users.ToList(), "All users fetched successfully.")
            : Result<List<UserDetails>>.FailureResult("No users found");
    }

    public async Task<Result<UserProfile>> GetProfileAsync(Guid userId)
    {
        var user = await userRepository.GetProfileByIdAsync(userId);
        return user != null
            ? Result<UserProfile>.SuccessResult(user, "Profile fetched successfully.")
            : Result<UserProfile>.FailureResult("Profile not found");
    }

    public async Task<Result<User>> GetUserByIdAsync(Guid id)
    {
        var user = await userRepository.GetByIdAsync(id);
        return user != null
            ? Result<User>.SuccessResult(user, "User fetched successfully.")
            : Result<User>.FailureResult("User not found");
    }

    public async Task<Result<bool>> UpdateProfileAsync(UpdateUserProfileRequest request, Guid userId)
    {
        var validationResult = await updateProfileValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new ValidationException(validationResult.Errors);

        var user = await userRepository.GetByIdAsync(userId);
        if (user == null)
            return Result<bool>.FailureResult("User not found");

        user.FirstName = request.FirstName.Trim();
        user.LastName = request.LastName.Trim();
        user.Email = user.Email;
        user.UpdatedAt = DateTime.UtcNow;

        await userRepository.UpdateAsync(user);
        return Result<bool>.SuccessResult(true, "Profile updated successfully.");
    }

    public async Task<Result<bool>> UpdateUserRoleAsync(Guid id, UpdateUserRoleRequest request)
    {
        var validationResult = await updateRoleValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new ValidationException(validationResult.Errors);

        var user = await userRepository.GetByIdAsync(id);
        if (user == null)
            return Result<bool>.FailureResult("User not found");

        var role = await roleRepository.GetByIdAsync(user.RoleId);
        if (role == null)
            return Result<bool>.FailureResult("Role not found");

        if(role.Name.ToLower() == "admin")
            return Result<bool>.FailureResult("Your are forbid to update this user's role.");

        await userRepository.UpdateRoleAsync(id, request.RoleId);
        return Result<bool>.SuccessResult(true, "User's role updated successfully.");
    }

    public async Task<Result<bool>> UpdateUserStatusAsync(Guid id, UpdateUserStatusRequest request)
    {
        var validationResult = await updateStatusValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new ValidationException(validationResult.Errors);

        var user = await userRepository.GetByIdAsync(id);
        if (user == null)
            return Result<bool>.FailureResult("User not found");

        var role = await roleRepository.GetByIdAsync(user.RoleId);
        if (role == null)
            return Result<bool>.FailureResult("Role not found");

        if (role.Name.ToLower() == "admin")
            return Result<bool>.FailureResult("Your are forbid to update this user's status.");

        if (request.IsActive)
            await userRepository.ActivateAsync(id);
        else
            await userRepository.DeactivateAsync(id);

        return Result<bool>.SuccessResult(true, "User's status updated successfully.");
    }
}
