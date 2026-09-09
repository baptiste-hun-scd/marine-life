namespace MarineLife.Database.Entities;

/// <summary>A taxonomic order (ordre).</summary>
public class Ordre
{
    public required string Id { get; set; }
    public required string Nom { get; set; }

    public required string ClasseId { get; set; }
    public Classe? Classe { get; set; }

    public List<Species> Species { get; set; } = [];
}
