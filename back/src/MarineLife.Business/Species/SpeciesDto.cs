namespace MarineLife.Business.Species;

/// <summary>A marine species, as exposed to API clients.</summary>
public record SpeciesDto(
    string Id,
    string CommonName,
    string ScientificName,
    string Embranchement,
    string Classe,
    string Ordre,
    string VulnerabilityLevel,
    string? Description,
    string? Habitat,
    string? ImageUrl,
    string? DistributionMapUrl);
