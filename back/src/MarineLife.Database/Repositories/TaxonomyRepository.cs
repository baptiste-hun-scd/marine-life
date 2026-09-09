using MarineLife.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace MarineLife.Database.Repositories;

public class TaxonomyRepository(MarineLifeDbContext dbContext) : ITaxonomyRepository
{
    public async Task<IReadOnlyList<Embranchement>> GetTreeAsync(CancellationToken cancellationToken) =>
        await dbContext.Embranchements.Include(e => e.Classes).ThenInclude(c => c.Ordres).ToListAsync(cancellationToken);
}
