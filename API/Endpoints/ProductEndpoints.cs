namespace API.Endpoints;

public static class ProductEndpoints
{
    public static void MapProductEndpoints(this IEndpointRouteBuilder builder)
    {
        var endpoints = builder.MapGroup("products")
                               .WithTags("Products");
    }
}
