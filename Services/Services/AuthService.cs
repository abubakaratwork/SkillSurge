namespace Services.Services;

public class AuthService(
    IUserRepository userRepository,
    IRoleRepository roleRepository,
    IRefreshTokenRepository refreshTokenRepository,
    IPasswordResetTokenRepository passwordResetTokenRepository,
    PasswordHashHandler passwordHasher,
    TokensHandler tokenHandler,
    IValidator<LoginRequest> loginValidator,
    IValidator<SignupRequest> signuppValidator,
    IValidator<ForgotPasswordRequest> forgotPasswordValidator,
    IValidator<ResetPasswordRequest> resetPasswordValidator
) : IAuthService
{
    public async Task<Result<bool>> SignupAsync(SignupRequest request)
    {
        var validationResult = await signuppValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new ValidationException(validationResult.Errors);

        var existingUser = await userRepository.GetByEmailAsync(request.Email);

        if (existingUser is not null)
            return Result<bool>.FailureResult("Email already exists");

        var role = await roleRepository.GetDefaultRoleAsync();

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = request.Email.Trim(),
            PasswordHash = passwordHasher.HashPassword(request.Password),
            RoleId = role.Id,
            CreatedAt = DateTime.UtcNow
        };

        await userRepository.AddAsync(user);

        return Result<bool>.SuccessResult(true, "User registered successfully");
    }

    public async Task<Result<LoginResponse>> LoginAsync(LoginRequest request)
    {
        var validationResult = await loginValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new ValidationException(validationResult.Errors);

        var user = await userRepository.GetByEmailAsync(request.Email);

        if (user is null)
            return Result<LoginResponse>.FailureResult("Invalid credentials");

        if (!user.IsActive)
            return Result<LoginResponse>.FailureResult("User account disabled");

        var validPassword = passwordHasher.VerifyPassword(request.Password, user.PasswordHash);

        if (!validPassword)
            return Result<LoginResponse>.FailureResult("Invalid credentials");

        var role = await roleRepository.GetByIdAsync(user.RoleId);

        var accessToken = tokenHandler.GenerateAccessToken(user, role);

        var refreshTokenValue = tokenHandler.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = refreshTokenValue,
            UserId = user.Id,
            ExpiryDate = DateTime.UtcNow.AddDays(7),
            IsRevoked = false,
            CreatedAt = DateTime.UtcNow
        };

        await refreshTokenRepository.AddAsync(refreshToken);

        await userRepository.UpdateLastLoginAsync(user.Id);

        var response = new LoginResponse
        {
            AccessToken = accessToken,
            ExpiresInMinutes = 10,
            RefreshToken = refreshTokenValue,
            Username = $"{user.FirstName} {user.LastName}",
        };

        return Result<LoginResponse>.SuccessResult(response, "Logged in successfully.");
    }

    public async Task<Result<RefreshTokenResponse>> RefreshTokenAsync(string refreshToken)
    {
        var token = await refreshTokenRepository.GetByTokenAsync(refreshToken);

        if (token is null)
            return Result<RefreshTokenResponse>.FailureResult("Invalid refresh token");

        if (token.ExpiryDate < DateTime.UtcNow)
            return Result<RefreshTokenResponse>.FailureResult("Refresh token expired");

        var user = await userRepository.GetByIdAsync(token.UserId);

        if (user is null || !user.IsActive)
            return Result<RefreshTokenResponse>.FailureResult("User invalid");

        var role = await roleRepository.GetByIdAsync(user.RoleId);

        var newAccessToken = tokenHandler.GenerateAccessToken(user, role!);

        var response = new RefreshTokenResponse
        {
            AccessToken = newAccessToken,
            ExpiresInMinutes = 10,
            RefreshToken = refreshToken,
            Username = $"{user.FirstName} {user.LastName}",
        };

        return Result<RefreshTokenResponse>.SuccessResult(response, "");
    }

    public async Task<Result<bool>> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var validationResult = await forgotPasswordValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new ValidationException(validationResult.Errors);

        var user = await userRepository.GetByEmailAsync(request.Email);

        if (user is null)
            return Result<bool>.SuccessResult(true, "If email exists, reset link sent");

        var tokenValue = tokenHandler.GenerateRefreshToken();

        var token = new PasswordResetToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = tokenValue,
            ExpiryDate = DateTime.UtcNow.AddMinutes(30),
            IsUsed = false,
            CreatedAt = DateTime.UtcNow
        };

        await passwordResetTokenRepository.AddAsync(token);

        // send email here (not implemented)

        return Result<bool>.SuccessResult(true, "Password reset email sent");
    }

    public async Task<Result<bool>> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var validationResult = await resetPasswordValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new ValidationException(validationResult.Errors);

        var token = await passwordResetTokenRepository.GetByTokenAsync(request.Token);

        if (token is null)
            return Result<bool>.FailureResult("Invalid token");

        if (token.ExpiryDate < DateTime.UtcNow)
            return Result<bool>.FailureResult("Token expired");

        if (token.IsUsed)
            return Result<bool>.FailureResult("Token already used");

        var user = await userRepository.GetByIdAsync(token.UserId);

        if (user is null)
            return Result<bool>.FailureResult("User not found");

        var newPasswordHash = passwordHasher.HashPassword(request.NewPassword);

        await userRepository.UpdatePasswordAsync(user.Id, newPasswordHash);

        await passwordResetTokenRepository.MarkAsUsedAsync(token.Id);

        return Result<bool>.SuccessResult(true, "Password updated successfully");
    }
}