using API.Endpoints;

namespace API.Extensions;

public static class EndpointsConfigurationExtensions
{
    public static void MapEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapAuthEndpoints();
        app.MapUserEndpoints();
        app.MapProductEndpoints();
    }
}
