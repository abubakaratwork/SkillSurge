namespace API.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder builder)
    {
        var endpoints = builder.MapGroup("users")
                               .WithTags("Users");
    }
}
