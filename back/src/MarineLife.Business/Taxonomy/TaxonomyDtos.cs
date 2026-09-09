namespace MarineLife.Business.Taxonomy;

/// <summary>A taxonomic order (ordre).</summary>
public record OrdreDto(string Id, string Nom);

/// <summary>A taxonomic class (classe), grouping orders.</summary>
public record ClasseDto(string Id, string Nom, IReadOnlyList<OrdreDto> Ordres);

/// <summary>A taxonomic phylum (embranchement), grouping classes.</summary>
public record EmbranchementDto(string Id, string Nom, IReadOnlyList<ClasseDto> Classes);
