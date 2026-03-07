using Domain.Models.Requests.AuthRequests;

namespace API.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder builder)
    {
        var endpoints = builder.MapGroup("auth")
                               .WithTags("Authentication");

        endpoints.MapPost("login", LoginAsync)
                 .WithName("Login");

        endpoints.MapPost("signup", SignupAsync)
                 .WithName("Signup");

        endpoints.MapPost("forgotPassword", ForgotPasswordAsync)
                 .WithName("Forgot Password");

        endpoints.MapPost("resetPassword", ResetPasswordAsync)
                 .WithName("Reset Password");

        endpoints.MapPost("refreshToken", RefreshTokenAsync)
                 .WithName("Refresh Token");
    }

    public static async Task<IResult> LoginAsync([FromBody] LoginRequest request, IAuthService authService)
    {
        var result = await authService.LoginAsync(request);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> SignupAsync([FromBody] SignupRequest request, IAuthService authService)
    {
        var result = await authService.SignupAsync(request);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> ForgotPasswordAsync([FromBody] ForgotPasswordRequest request, IAuthService authService)
    {
        var result = await authService.ForgotPasswordAsync(request);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> ResetPasswordAsync([FromBody] ResetPasswordRequest request, IAuthService authService)
    {
        var result = await authService.ResetPasswordAsync(request);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> RefreshTokenAsync([FromBody] string refreshToken, IAuthService authService)
    {
        var result = await authService.RefreshTokenAsync(refreshToken);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }
}
