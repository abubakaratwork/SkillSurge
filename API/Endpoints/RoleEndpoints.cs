using Domain.Models.Requests.RoleRequests;

namespace API.Endpoints;

public static class RoleEndpoints
{
    public static void MapRoleEndpoints(this IEndpointRouteBuilder builder)
    {
        var endpoints = builder.MapGroup("roles")
                               .WithTags("Roles");

        endpoints.MapGet("/", GetAllRoleAsync);

        endpoints.MapGet("/{id:guid}", GetRoleByIdAsync);
    }

    public static async Task<IResult> GetAllRoleAsync(
        IRoleService roleService)
    {
        var result = await roleService.GetAllRolesAsync();

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> GetRoleByIdAsync(
        Guid id,
        IRoleService roleService)
    {
        var result = await roleService.GetRoleByIdAsync(id);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> UpdateRoleAsync(
        Guid id,
        [FromBody] UpdateRoleRequest request,
        IRoleService roleService)
    {
        var result = await roleService.UpdateRoleAsync(id, request);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }
}

