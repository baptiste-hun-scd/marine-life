using DbSpecies = MarineLife.Database.Entities.Species;
using MarineLife.Database.Repositories;

namespace MarineLife.Business.Species;

public class SpeciesService(ISpeciesRepository speciesRepository) : ISpeciesService
{
    public async Task<SpeciesDto?> GetByIdAsync(string id, CancellationToken cancellationToken)
    {
        var species = await speciesRepository.GetByIdAsync(id, cancellationToken);
        return species is null ? null : ToDto(species);
    }

    public async Task<IReadOnlyList<SpeciesDto>> SearchAsync(SpeciesSearchRequest request, CancellationToken cancellationToken)
    {
        var query = new SpeciesQuery(request.Term, request.EmbranchementIds, request.ClasseIds, request.OrdreIds);
        var species = await speciesRepository.SearchAsync(query, cancellationToken);
        return species.Select(ToDto).ToList();
    }

    public async Task<IReadOnlyList<SpeciesDto>> GetLatestAsync(int limit, CancellationToken cancellationToken)
    {
        var species = await speciesRepository.GetLatestAsync(limit, cancellationToken);
        return species.Select(ToDto).ToList();
    }

    private static SpeciesDto ToDto(DbSpecies species) =>
        new(
            species.Id,
            species.CommonName,
            species.ScientificName,
            species.Ordre!.Classe!.Embranchement!.Nom,
            species.Ordre.Classe.Nom,
            species.Ordre.Nom,
            species.VulnerabilityLevel.ToString().ToLowerInvariant(),
            species.Description,
            species.Habitat,
            species.ImageUrl,
            species.DistributionMapUrl);
}
