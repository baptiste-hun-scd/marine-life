using MarineLife.Database.Entities;

namespace MarineLife.Database.Repositories;

public interface ISpeciesRepository
{
    Task<Species?> GetByIdAsync(string id, CancellationToken cancellationToken);

    Task<IReadOnlyList<Species>> SearchAsync(SpeciesQuery query, CancellationToken cancellationToken);

    Task<IReadOnlyList<Species>> GetLatestAsync(int limit, CancellationToken cancellationToken);
}
