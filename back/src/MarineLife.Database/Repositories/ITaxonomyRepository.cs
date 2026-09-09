using MarineLife.Database.Entities;

namespace MarineLife.Database.Repositories;

public interface ITaxonomyRepository
{
    /// <summary>The full taxonomy tree (embranchement -&gt; classes -&gt; ordres).</summary>
    Task<IReadOnlyList<Embranchement>> GetTreeAsync(CancellationToken cancellationToken);
}
