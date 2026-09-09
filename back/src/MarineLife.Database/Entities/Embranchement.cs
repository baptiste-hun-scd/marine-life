namespace MarineLife.Database.Entities;

/// <summary>A taxonomic phylum (embranchement), grouping classes.</summary>
public class Embranchement
{
    public required string Id { get; set; }
    public required string Nom { get; set; }

    public List<Classe> Classes { get; set; } = [];
}
