using MarineLife.Database.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace MarineLife.Database;

public static class DependencyInjection
{
    public static IServiceCollection AddDatabase(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<MarineLifeDbContext>(options => options.UseSqlite(connectionString));

        services.AddScoped<ISpeciesRepository, SpeciesRepository>();
        services.AddScoped<ITaxonomyRepository, TaxonomyRepository>();

        return services;
    }
}
