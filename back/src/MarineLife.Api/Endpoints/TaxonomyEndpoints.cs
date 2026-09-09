using MarineLife.Business.Taxonomy;

namespace MarineLife.Api.Endpoints;

public static class TaxonomyEndpoints
{
    public static void MapTaxonomyEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet(
            "/api/taxonomy",
            async (ITaxonomyService taxonomyService, CancellationToken cancellationToken) =>
                await taxonomyService.GetTreeAsync(cancellationToken));
    }
}
