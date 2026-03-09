namespace Services.Abstractions.Services;

public interface IAuthService
{
    Task<Result<LoginResponse>> LoginAsync(LoginRequest request);
    Task<Result<bool>> SignupAsync(SignupRequest request);
    Task<Result<bool>> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<Result<bool>> ResetPasswordAsync(ResetPasswordRequest request);
    Task<Result<RefreshTokenResponse>> RefreshTokenAsync(string refreshToken);
}
