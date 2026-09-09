namespace MarineLife.Business.Taxonomy;

public interface ITaxonomyService
{
    /// <summary>The full taxonomy tree (embranchement -&gt; classes -&gt; ordres) used to filter species.</summary>
    Task<IReadOnlyList<EmbranchementDto>> GetTreeAsync(CancellationToken cancellationToken);
}
