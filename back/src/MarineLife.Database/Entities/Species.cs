namespace MarineLife.Database.Entities;

/// <summary>A marine species.</summary>
public class Species
{
    public required string Id { get; set; }
    public required string CommonName { get; set; }
    public required string ScientificName { get; set; }
    public required VulnerabilityLevel VulnerabilityLevel { get; set; }
    public string? Description { get; set; }
    public string? Habitat { get; set; }
    public string? ImageUrl { get; set; }
    public string? DistributionMapUrl { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public required string OrdreId { get; set; }
    public Ordre? Ordre { get; set; }
}
