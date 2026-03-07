using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Services.Helpers;

namespace Services;

public static class DependencyInjections
{
    public static IServiceCollection AddServicesDI(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<PasswordHashHandler>();
        services.AddSingleton<TokensHandler>();

        return services;
    }
}
