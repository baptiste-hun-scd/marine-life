namespace MarineLife.Business.Species;

public interface ISpeciesService
{
    Task<SpeciesDto?> GetByIdAsync(string id, CancellationToken cancellationToken);

    Task<IReadOnlyList<SpeciesDto>> SearchAsync(SpeciesSearchRequest request, CancellationToken cancellationToken);

    Task<IReadOnlyList<SpeciesDto>> GetLatestAsync(int limit, CancellationToken cancellationToken);
}
