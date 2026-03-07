using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Persistence;

public static class DependencyInjections
{
    public static IServiceCollection AddPersistenceDI(this IServiceCollection services, IConfiguration configuration)
    {
        return services;
    }
}
