using Domain.Settings;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Services.Services;

namespace Services;

public static class DependencyInjections
{
    public static IServiceCollection AddServicesDI(this IServiceCollection services, IConfiguration configuration)
    {
        #region AppSettings
        services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
        services.Configure<EmailSettings>(configuration.GetSection("EmailSettings"));
        #endregion

        #region Handlers
        services.AddSingleton<PasswordHashHandler>();
        services.AddSingleton<TokensHandler>();
        #endregion

        #region Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IAdminService, AdminService>();
        #endregion

        #region Helpers
        #endregion

        services.AddValidatorsFromAssembly(typeof(DependencyInjections).Assembly);

        return services;
    }
}
