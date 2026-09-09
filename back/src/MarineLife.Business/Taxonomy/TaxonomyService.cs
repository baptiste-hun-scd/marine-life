using MarineLife.Database.Repositories;

namespace MarineLife.Business.Taxonomy;

public class TaxonomyService(ITaxonomyRepository taxonomyRepository) : ITaxonomyService
{
    public async Task<IReadOnlyList<EmbranchementDto>> GetTreeAsync(CancellationToken cancellationToken)
    {
        var tree = await taxonomyRepository.GetTreeAsync(cancellationToken);

        return tree
            .Select(embranchement => new EmbranchementDto(
                embranchement.Id,
                embranchement.Nom,
                embranchement.Classes
                    .Select(classe => new ClasseDto(
                        classe.Id,
                        classe.Nom,
                        classe.Ordres.Select(ordre => new OrdreDto(ordre.Id, ordre.Nom)).ToList()))
                    .ToList()))
            .ToList();
    }
}
