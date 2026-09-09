using MarineLife.Business.Species;

namespace MarineLife.Api.Endpoints;

public static class SpeciesEndpoints
{
    public static void MapSpeciesEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/species");

        group.MapGet(
            "/",
            async (
                ISpeciesService speciesService,
                CancellationToken cancellationToken,
                string? term,
                string[]? embranchementIds,
                string[]? classeIds,
                string[]? ordreIds) =>
            {
                var request = new SpeciesSearchRequest(term, embranchementIds, classeIds, ordreIds);
                return await speciesService.SearchAsync(request, cancellationToken);
            });

        group.MapGet(
            "/latest",
            async (ISpeciesService speciesService, CancellationToken cancellationToken, int limit = 8) =>
                await speciesService.GetLatestAsync(limit, cancellationToken));

        group.MapGet(
            "/{id}",
            async (string id, ISpeciesService speciesService, CancellationToken cancellationToken) =>
            {
                var species = await speciesService.GetByIdAsync(id, cancellationToken);
                return species is null ? Results.NotFound() : Results.Ok(species);
            });
    }
}
