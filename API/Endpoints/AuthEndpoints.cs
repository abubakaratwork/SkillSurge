namespace API.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder builder)
    {
        var endpoints = builder.MapGroup("auth")
                               .WithTags("Authentication");

        endpoints.MapPost("login", LoginAsync);

        endpoints.MapPost("signup", SignupAsync);

        endpoints.MapPost("forgotPassword", ForgotPasswordAsync);

        endpoints.MapPost("resetPassword", ResetPasswordAsync);

        endpoints.MapPost("refreshToken", RefreshTokenAsync);
    }

    public static async Task<IResult> LoginAsync(
        [FromBody] LoginRequest request, 
        IAuthService authService,
        HttpContext context)
    {
        var result = await authService.LoginAsync(request);

        if(result.Success && result.Data?.RefreshToken != null)
        {
            context.Response.Cookies.Append("RefreshToken", result.Data.RefreshToken);
            result.Data.RefreshToken = null;
        }

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> SignupAsync(
        [FromBody] SignupRequest request, 
        IAuthService authService)
    {
        var result = await authService.SignupAsync(request);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> ForgotPasswordAsync(
        [FromBody] ForgotPasswordRequest request,
        IAuthService authService)
    {
        var result = await authService.ForgotPasswordAsync(request);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> ResetPasswordAsync(
        [FromBody] ResetPasswordRequest request,
        IAuthService authService)
    {
        var result = await authService.ResetPasswordAsync(request);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> RefreshTokenAsync(
        [FromBody] string refreshToken,
        IAuthService authService,
        HttpContext context)
    {
        var result = await authService.RefreshTokenAsync(refreshToken);

        if (result.Success && result.Data?.RefreshToken != null)
        {
            context.Response.Cookies.Append("RefreshToken", result.Data.RefreshToken);
            result.Data.RefreshToken = null;
        }

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }
}
