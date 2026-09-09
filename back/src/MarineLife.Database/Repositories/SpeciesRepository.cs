using MarineLife.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace MarineLife.Database.Repositories;

public class SpeciesRepository(MarineLifeDbContext dbContext) : ISpeciesRepository
{
    public Task<Species?> GetByIdAsync(string id, CancellationToken cancellationToken) =>
        Taxonomized().FirstOrDefaultAsync(species => species.Id == id, cancellationToken);

    public async Task<IReadOnlyList<Species>> SearchAsync(SpeciesQuery query, CancellationToken cancellationToken)
    {
        var species = Taxonomized();

        if (query.EmbranchementIds is { Count: > 0 } embranchementIds)
        {
            species = species.Where(s => embranchementIds.Contains(s.Ordre!.Classe!.EmbranchementId));
        }

        if (query.ClasseIds is { Count: > 0 } classeIds)
        {
            species = species.Where(s => classeIds.Contains(s.Ordre!.ClasseId));
        }

        if (query.OrdreIds is { Count: > 0 } ordreIds)
        {
            species = species.Where(s => ordreIds.Contains(s.OrdreId));
        }

        if (!string.IsNullOrWhiteSpace(query.Term))
        {
            var term = query.Term.Trim();
            species = species.Where(s =>
                EF.Functions.Like(s.CommonName, $"%{term}%") || EF.Functions.Like(s.ScientificName, $"%{term}%"));
        }

        return await species.ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Species>> GetLatestAsync(int limit, CancellationToken cancellationToken) =>
        await Taxonomized().OrderByDescending(s => s.CreatedAtUtc).Take(limit).ToListAsync(cancellationToken);

    private IQueryable<Species> Taxonomized() =>
        dbContext.Species.Include(s => s.Ordre!).ThenInclude(o => o.Classe!).ThenInclude(c => c.Embranchement);
}
