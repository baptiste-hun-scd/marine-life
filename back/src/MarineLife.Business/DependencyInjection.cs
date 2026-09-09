using MarineLife.Business.Species;
using MarineLife.Business.Taxonomy;
using Microsoft.Extensions.DependencyInjection;

namespace MarineLife.Business;

public static class DependencyInjection
{
    public static IServiceCollection AddBusiness(this IServiceCollection services)
    {
        services.AddScoped<ISpeciesService, SpeciesService>();
        services.AddScoped<ITaxonomyService, TaxonomyService>();

        return services;
    }
}
