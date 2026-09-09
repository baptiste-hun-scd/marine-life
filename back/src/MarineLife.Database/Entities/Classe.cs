namespace MarineLife.Database.Entities;

/// <summary>A taxonomic class (classe), grouping orders.</summary>
public class Classe
{
    public required string Id { get; set; }
    public required string Nom { get; set; }

    public required string EmbranchementId { get; set; }
    public Embranchement? Embranchement { get; set; }

    public List<Ordre> Ordres { get; set; } = [];
}
