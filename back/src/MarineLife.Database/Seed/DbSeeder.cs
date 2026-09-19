using System.Text.Json;
using System.Text.Json.Serialization;
using MarineLife.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace MarineLife.Database.Seed;

/// <summary>
/// Seeds the database with the taxonomy tree and species catalog read from a JSON file
/// (<c>Seed/seed-data.json</c> by default), so the API has something to serve while a real data
/// source doesn't exist yet.
/// </summary>
public static class DbSeeder
{
    public static readonly string DefaultFilePath = Path.Combine(AppContext.BaseDirectory, "Seed", "seed-data.json");

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() },
    };

    public static async Task SeedAsync(
        MarineLifeDbContext dbContext,
        string? filePath = null,
        CancellationToken cancellationToken = default)
    {
        if (await dbContext.Species.AnyAsync(cancellationToken))
        {
            return;
        }

        filePath ??= DefaultFilePath;

        await using var stream = File.OpenRead(filePath);
        var data = await JsonSerializer.DeserializeAsync<SeedData>(stream, JsonOptions, cancellationToken)
            ?? throw new InvalidOperationException($"Seed file '{filePath}' is empty.");

        dbContext.Embranchements.AddRange(data.Embranchements.Select(ToEntity));
        dbContext.Species.AddRange(ToEntities(data.Species));

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static Embranchement ToEntity(EmbranchementSeed embranchement) =>
        new()
        {
            Id = embranchement.Id,
            Nom = embranchement.Nom,
            Classes = embranchement.Classes
                .Select(classe => new Classe
                {
                    Id = classe.Id,
                    Nom = classe.Nom,
                    EmbranchementId = embranchement.Id,
                    Ordres = classe.Ordres
                        .Select(ordre => new Ordre { Id = ordre.Id, Nom = ordre.Nom, ClasseId = classe.Id })
                        .ToList(),
                })
                .ToList(),
        };

    private static List<Species> ToEntities(IReadOnlyList<SpeciesSeed> species)
    {
        var now = DateTime.UtcNow;

        // File order drives "latest": earlier entries are seeded as more recent.
        return species
            .Select((s, index) => new Species
            {
                Id = s.Id,
                CommonName = s.CommonName,
                ScientificName = s.ScientificName,
                OrdreId = s.OrdreId,
                VulnerabilityLevel = s.VulnerabilityLevel,
                Description = s.Description,
                Habitat = s.Habitat,
                ImageUrl = s.ImageUrl,
                DistributionMapUrl = s.DistributionMapUrl,
                CreatedAtUtc = now.AddMinutes(-index),
            })
            .ToList();
    }

    private sealed record SeedData(List<EmbranchementSeed> Embranchements, List<SpeciesSeed> Species);

    private sealed record EmbranchementSeed(string Id, string Nom, List<ClasseSeed> Classes);

    private sealed record ClasseSeed(string Id, string Nom, List<OrdreSeed> Ordres);

    private sealed record OrdreSeed(string Id, string Nom);

    private sealed record SpeciesSeed(
        string Id,
        string CommonName,
        string ScientificName,
        string OrdreId,
        VulnerabilityLevel VulnerabilityLevel,
        string? Description = null,
        string? Habitat = null,
        string? ImageUrl = null,
        string? DistributionMapUrl = null);
}
