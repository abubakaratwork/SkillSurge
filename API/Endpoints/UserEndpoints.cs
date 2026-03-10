using Domain.Entities;
using System.Security.Claims;

namespace API.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder builder)
    {
        var endpoints = builder.MapGroup("users")
                               .WithTags("Users")
                               .RequireAuthorization();

        endpoints.MapGet("/profile", GetProfileAsync);

        endpoints.MapPut("/profile", UpdateProfileAsync);

        endpoints.MapPost("/change-password", ChangePasswordAsync);

        endpoints.MapGet("/", GetAllUsersAsync)
                 .RequireAuthorization("Admin");

        endpoints.MapGet("/{id:guid}", GetUserByIdAsync);

        endpoints.MapPatch("/{id:guid}/role", UpdateUserRoleAsync)
                 .RequireAuthorization("Admin");

        endpoints.MapPatch("/{id:guid}/status", UpdateUserStatusAsync)
                 .RequireAuthorization("Admin");
    }

    public static async Task<IResult> GetProfileAsync(
       IUserService userService,
       ClaimsPrincipal user)
    {
        var result = await userService.GetProfileAsync(user.GetUserId());

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> UpdateProfileAsync(
        [FromBody] UpdateUserProfileRequest request,
        IUserService userService,
        ClaimsPrincipal user)
    {
        var result = await userService.UpdateProfileAsync(request, user.GetUserId());

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> ChangePasswordAsync(
        [FromBody] ChangePasswordRequest request,
        IUserService userService,
        ClaimsPrincipal user)
    {
        var result = await userService.ChangePasswordAsync(request, user.GetUserId());

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> GetAllUsersAsync(
        IUserService userService)
    {
        var result = await userService.GetAllUsersAsync();

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> GetUserByIdAsync(
        Guid id,
        IUserService userService)
    {
        var result = await userService.GetUserByIdAsync(id);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> UpdateUserRoleAsync(
        Guid id,
        [FromBody] UpdateUserRoleRequest request,
        IUserService userService,
        ClaimsPrincipal user)
    {
        if (id == user.GetUserId())
            return Results.Forbid();

        var result = await userService.UpdateUserRoleAsync(id, request);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> UpdateUserStatusAsync(
        Guid id,
        [FromBody] UpdateUserStatusRequest request,
        IUserService userService,
        ClaimsPrincipal user)
    {
        if (id == user.GetUserId())
            return Results.Forbid();

        var result = await userService.UpdateUserStatusAsync(id, request);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }
}
