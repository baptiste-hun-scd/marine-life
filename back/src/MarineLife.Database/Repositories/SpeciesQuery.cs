namespace MarineLife.Database.Repositories;

/// <summary>Search filter for <see cref="ISpeciesRepository.SearchAsync"/>.</summary>
public record SpeciesQuery(
    string? Term,
    IReadOnlyCollection<string>? EmbranchementIds,
    IReadOnlyCollection<string>? ClasseIds,
    IReadOnlyCollection<string>? OrdreIds);
