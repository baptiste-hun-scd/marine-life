using MarineLife.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace MarineLife.Database.Seed;

/// <summary>
/// Seeds the database with the taxonomy tree and species catalog that used to live as fake data
/// in the front end, so the API has something to serve while a real data source doesn't exist yet.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(MarineLifeDbContext dbContext, CancellationToken cancellationToken = default)
    {
        if (await dbContext.Species.AnyAsync(cancellationToken))
        {
            return;
        }

        dbContext.Embranchements.AddRange(BuildTaxonomy());
        dbContext.Species.AddRange(BuildSpecies());

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static List<Embranchement> BuildTaxonomy() =>
    [
        new Embranchement
        {
            Id = "chordata",
            Nom = "Chordés",
            Classes =
            [
                new Classe
                {
                    Id = "mammalia",
                    Nom = "Mammifères",
                    EmbranchementId = "chordata",
                    Ordres =
                    [
                        new Ordre { Id = "cetacea", Nom = "Cétacés", ClasseId = "mammalia" },
                        new Ordre { Id = "carnivora", Nom = "Carnivores", ClasseId = "mammalia" },
                    ],
                },
                new Classe
                {
                    Id = "chondrichthyes",
                    Nom = "Poissons cartilagineux",
                    EmbranchementId = "chordata",
                    Ordres =
                    [
                        new Ordre { Id = "carcharhiniformes", Nom = "Requins", ClasseId = "chondrichthyes" },
                        new Ordre { Id = "rajiformes", Nom = "Raies", ClasseId = "chondrichthyes" },
                    ],
                },
                new Classe
                {
                    Id = "actinopterygii",
                    Nom = "Poissons osseux",
                    EmbranchementId = "chordata",
                    Ordres =
                    [
                        new Ordre { Id = "perciformes", Nom = "Perciformes", ClasseId = "actinopterygii" },
                        new Ordre { Id = "anguilliformes", Nom = "Anguilliformes", ClasseId = "actinopterygii" },
                    ],
                },
                new Classe
                {
                    Id = "reptilia",
                    Nom = "Reptiles",
                    EmbranchementId = "chordata",
                    Ordres = [new Ordre { Id = "testudines", Nom = "Tortues marines", ClasseId = "reptilia" }],
                },
            ],
        },
        new Embranchement
        {
            Id = "mollusca",
            Nom = "Mollusques",
            Classes =
            [
                new Classe
                {
                    Id = "cephalopoda",
                    Nom = "Céphalopodes",
                    EmbranchementId = "mollusca",
                    Ordres =
                    [
                        new Ordre { Id = "octopoda", Nom = "Pieuvres", ClasseId = "cephalopoda" },
                        new Ordre { Id = "decapodiformes", Nom = "Calmars et seiches", ClasseId = "cephalopoda" },
                    ],
                },
                new Classe
                {
                    Id = "gastropoda",
                    Nom = "Gastéropodes",
                    EmbranchementId = "mollusca",
                    Ordres = [new Ordre { Id = "nudibranchia", Nom = "Nudibranches", ClasseId = "gastropoda" }],
                },
            ],
        },
        new Embranchement
        {
            Id = "cnidaria",
            Nom = "Cnidaires",
            Classes =
            [
                new Classe
                {
                    Id = "anthozoa",
                    Nom = "Anthozoaires",
                    EmbranchementId = "cnidaria",
                    Ordres = [new Ordre { Id = "scleractinia", Nom = "Coraux durs", ClasseId = "anthozoa" }],
                },
                new Classe
                {
                    Id = "scyphozoa",
                    Nom = "Scyphozoaires",
                    EmbranchementId = "cnidaria",
                    Ordres = [new Ordre { Id = "semaeostomeae", Nom = "Méduses", ClasseId = "scyphozoa" }],
                },
            ],
        },
        new Embranchement
        {
            Id = "arthropoda",
            Nom = "Arthropodes",
            Classes =
            [
                new Classe
                {
                    Id = "malacostraca",
                    Nom = "Malacostracés",
                    EmbranchementId = "arthropoda",
                    Ordres =
                    [
                        new Ordre
                        {
                            Id = "decapoda",
                            Nom = "Crabes, crevettes et homards",
                            ClasseId = "malacostraca",
                        },
                    ],
                },
            ],
        },
    ];

    private static List<Species> BuildSpecies()
    {
        var now = DateTime.UtcNow;
        var order = 0;

        Species Create(
            string id,
            string commonName,
            string scientificName,
            string ordreId,
            VulnerabilityLevel vulnerabilityLevel,
            string? description = null,
            string? habitat = null,
            string? imageUrl = "https://picsum.photos/200/300",
            string? distributionMapUrl = null) =>
            new()
            {
                Id = id,
                CommonName = commonName,
                ScientificName = scientificName,
                OrdreId = ordreId,
                VulnerabilityLevel = vulnerabilityLevel,
                Description = description,
                Habitat = habitat,
                ImageUrl = imageUrl,
                DistributionMapUrl = distributionMapUrl,
                // Insertion order drives "latest": earlier entries are seeded as more recent.
                CreatedAtUtc = now.AddMinutes(-order++),
            };

        return
        [
            Create(
                "grand-dauphin",
                "Grand dauphin",
                "Tursiops truncatus",
                "cetacea",
                VulnerabilityLevel.Vert,
                description:
                    "Le grand dauphin est un cétacé très sociable, réputé pour son intelligence et vivant en groupes " +
                    "structurés appelés pods, qui peuvent compter de quelques individus à plusieurs centaines. Il " +
                    "communique grâce à un répertoire varié de sifflements, de clics d'écholocation et de langage " +
                    "corporel, et chasse souvent en coopération pour rabattre les bancs de poissons. Sa maturité " +
                    "sexuelle est atteinte entre 5 et 13 ans selon les populations, et sa longévité peut dépasser " +
                    "40 ans à l'état sauvage.",
                habitat: "Eaux côtières tempérées et tropicales du monde entier.",
                imageUrl: "https://picsum.photos/1200/675",
                distributionMapUrl: "https://picsum.photos/800/400"),
            Create("baleine-bleue", "Baleine bleue", "Balaenoptera musculus", "cetacea", VulnerabilityLevel.Rouge),
            Create("orque", "Orque", "Orcinus orca", "cetacea", VulnerabilityLevel.Orange),
            Create("phoque-gris", "Phoque gris", "Halichoerus grypus", "carnivora", VulnerabilityLevel.Vert),
            Create("loutre-de-mer", "Loutre de mer", "Enhydra lutris", "carnivora", VulnerabilityLevel.Orange),
            Create(
                "grand-requin-blanc",
                "Grand requin blanc",
                "Carcharodon carcharias",
                "carcharhiniformes",
                VulnerabilityLevel.Rouge),
            Create(
                "requin-marteau-halicorne",
                "Requin-marteau halicorne",
                "Sphyrna lewini",
                "carcharhiniformes",
                VulnerabilityLevel.Rouge),
            Create(
                "requin-tigre",
                "Requin-tigre",
                "Galeocerdo cuvier",
                "carcharhiniformes",
                VulnerabilityLevel.Orange),
            Create("raie-manta", "Raie manta", "Mobula birostris", "rajiformes", VulnerabilityLevel.Orange),
            Create(
                "raie-pastenague",
                "Raie pastenague",
                "Dasyatis pastinaca",
                "rajiformes",
                VulnerabilityLevel.Vert),
            Create("thon-rouge", "Thon rouge", "Thunnus thynnus", "perciformes", VulnerabilityLevel.Rouge),
            Create("merou-brun", "Mérou brun", "Epinephelus marginatus", "perciformes", VulnerabilityLevel.Orange),
            Create(
                "poisson-clown",
                "Poisson-clown",
                "Amphiprion ocellaris",
                "perciformes",
                VulnerabilityLevel.Vert),
            Create(
                "anguille-europeenne",
                "Anguille européenne",
                "Anguilla anguilla",
                "anguilliformes",
                VulnerabilityLevel.Rouge),
            Create(
                "murene-commune",
                "Murène commune",
                "Muraena helena",
                "anguilliformes",
                VulnerabilityLevel.Vert),
            Create(
                "tortue-caouanne",
                "Tortue caouanne",
                "Caretta caretta",
                "testudines",
                VulnerabilityLevel.Orange),
            Create("tortue-verte", "Tortue verte", "Chelonia mydas", "testudines", VulnerabilityLevel.Orange),
            Create("tortue-luth", "Tortue luth", "Dermochelys coriacea", "testudines", VulnerabilityLevel.Rouge),
            Create(
                "pieuvre-commune",
                "Pieuvre commune",
                "Octopus vulgaris",
                "octopoda",
                VulnerabilityLevel.Vert),
            Create(
                "pieuvre-geante-du-pacifique",
                "Pieuvre géante du Pacifique",
                "Enteroctopus dofleini",
                "octopoda",
                VulnerabilityLevel.Vert),
            Create(
                "calmar-geant",
                "Calmar géant",
                "Architeuthis dux",
                "decapodiformes",
                VulnerabilityLevel.Vert),
            Create(
                "seiche-commune",
                "Seiche commune",
                "Sepia officinalis",
                "decapodiformes",
                VulnerabilityLevel.Vert),
            Create(
                "nudibranche-espagnol",
                "Nudibranche espagnol",
                "Flabellina affinis",
                "nudibranchia",
                VulnerabilityLevel.Vert),
            Create(
                "doris-dalmatien",
                "Doris dalmatien",
                "Peltodoris atromaculata",
                "nudibranchia",
                VulnerabilityLevel.Vert),
            Create(
                "corail-cerveau",
                "Corail cerveau",
                "Diploria labyrinthiformis",
                "scleractinia",
                VulnerabilityLevel.Orange),
            Create(
                "corail-corne-delan",
                "Corail corne d'élan",
                "Acropora palmata",
                "scleractinia",
                VulnerabilityLevel.Rouge),
            Create(
                "meduse-boussole",
                "Méduse boussole",
                "Chrysaora hysoscella",
                "semaeostomeae",
                VulnerabilityLevel.Vert),
            Create(
                "meduse-lune",
                "Méduse lune",
                "Aurelia aurita",
                "semaeostomeae",
                VulnerabilityLevel.Vert),
            Create(
                "crabe-vert-europeen",
                "Crabe vert européen",
                "Carcinus maenas",
                "decapoda",
                VulnerabilityLevel.Vert),
            Create(
                "homard-europeen",
                "Homard européen",
                "Homarus gammarus",
                "decapoda",
                VulnerabilityLevel.Orange),
            Create(
                "crevette-bouquet",
                "Crevette bouquet",
                "Palaemon serratus",
                "decapoda",
                VulnerabilityLevel.Vert),
        ];
    }
}
