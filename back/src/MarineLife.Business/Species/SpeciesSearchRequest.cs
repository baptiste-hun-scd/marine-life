namespace MarineLife.Business.Species;

public record SpeciesSearchRequest(
    string? Term,
    IReadOnlyCollection<string>? EmbranchementIds,
    IReadOnlyCollection<string>? ClasseIds,
    IReadOnlyCollection<string>? OrdreIds);
