using ConcreteAssociation.Application.Abstractions;
using ConcreteAssociation.Infrastructure.Configuration;
using ConcreteAssociation.Infrastructure.Persistence;
using ConcreteAssociation.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ConcreteAssociation.Infrastructure.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
                               ?? "Host=localhost;Port=5432;Database=concrete_association;Username=postgres;Password=postgres";

        services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));
        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IMobileNumberService, MobileNumberService>();
        services.AddScoped<IPasswordHasher, PasswordHasherAdapter>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IOtpSender, DevelopmentOtpSender>();
        services.AddScoped<IAuditLogger, AuditLogger>();

        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));

        return services;
    }
}
