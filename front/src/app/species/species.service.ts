import { computed, inject, Service, signal } from '@angular/core';
import { Species } from './species.model';
import { TaxonomyService } from './taxonomy.service';

/** Fake species detail, standing in until the `/api/species/:id` endpoint exists. */
const FAKE_SPECIES_DETAIL: Species = {
  id: 'grand-dauphin',
  commonName: 'Grand dauphin',
  scientificName: 'Tursiops truncatus',
  embranchement: 'Chordés',
  classe: 'Mammifères',
  ordre: 'Cétacés',
  vulnerabilityLevel: 'vert',
  description:
    "Le grand dauphin est un cétacé très sociable, réputé pour son intelligence et vivant en groupes structurés " +
    "appelés pods, qui peuvent compter de quelques individus à plusieurs centaines. Il communique grâce à un " +
    "répertoire varié de sifflements, de clics d'écholocation et de langage corporel, et chasse souvent en " +
    "coopération pour rabattre les bancs de poissons. Sa maturité sexuelle est atteinte entre 5 et 13 ans selon " +
    "les populations, et sa longévité peut dépasser 40 ans à l'état sauvage.",
  habitat: 'Eaux côtières tempérées et tropicales du monde entier.',
  imageUrl: 'https://picsum.photos/1200/675',
  distributionMapUrl: 'https://picsum.photos/800/400',
};

export interface SpeciesSearchParams {
  term: string;
  embranchementId?: string;
  classeId?: string;
  ordreId?: string;
}

/** Fake species, standing in until the `/api/species` search endpoint exists. */
const FAKE_SPECIES: Species[] = [
  {
    id: 'grand-dauphin',
    commonName: 'Grand dauphin',
    scientificName: 'Tursiops truncatus',
    embranchement: 'Chordés',
    classe: 'Mammifères',
    ordre: 'Cétacés',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'baleine-bleue',
    commonName: 'Baleine bleue',
    scientificName: 'Balaenoptera musculus',
    embranchement: 'Chordés',
    classe: 'Mammifères',
    ordre: 'Cétacés',
    vulnerabilityLevel: 'rouge',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'orque',
    commonName: 'Orque',
    scientificName: 'Orcinus orca',
    embranchement: 'Chordés',
    classe: 'Mammifères',
    ordre: 'Cétacés',
    vulnerabilityLevel: 'orange',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'phoque-gris',
    commonName: 'Phoque gris',
    scientificName: 'Halichoerus grypus',
    embranchement: 'Chordés',
    classe: 'Mammifères',
    ordre: 'Carnivores',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'loutre-de-mer',
    commonName: 'Loutre de mer',
    scientificName: 'Enhydra lutris',
    embranchement: 'Chordés',
    classe: 'Mammifères',
    ordre: 'Carnivores',
    vulnerabilityLevel: 'orange',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'grand-requin-blanc',
    commonName: 'Grand requin blanc',
    scientificName: 'Carcharodon carcharias',
    embranchement: 'Chordés',
    classe: 'Poissons cartilagineux',
    ordre: 'Requins',
    vulnerabilityLevel: 'rouge',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'requin-marteau-halicorne',
    commonName: 'Requin-marteau halicorne',
    scientificName: 'Sphyrna lewini',
    embranchement: 'Chordés',
    classe: 'Poissons cartilagineux',
    ordre: 'Requins',
    vulnerabilityLevel: 'rouge',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'requin-tigre',
    commonName: 'Requin-tigre',
    scientificName: 'Galeocerdo cuvier',
    embranchement: 'Chordés',
    classe: 'Poissons cartilagineux',
    ordre: 'Requins',
    vulnerabilityLevel: 'orange',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'raie-manta',
    commonName: 'Raie manta',
    scientificName: 'Mobula birostris',
    embranchement: 'Chordés',
    classe: 'Poissons cartilagineux',
    ordre: 'Raies',
    vulnerabilityLevel: 'orange',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'raie-pastenague',
    commonName: 'Raie pastenague',
    scientificName: 'Dasyatis pastinaca',
    embranchement: 'Chordés',
    classe: 'Poissons cartilagineux',
    ordre: 'Raies',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'thon-rouge',
    commonName: 'Thon rouge',
    scientificName: 'Thunnus thynnus',
    embranchement: 'Chordés',
    classe: 'Poissons osseux',
    ordre: 'Perciformes',
    vulnerabilityLevel: 'rouge',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'merou-brun',
    commonName: 'Mérou brun',
    scientificName: 'Epinephelus marginatus',
    embranchement: 'Chordés',
    classe: 'Poissons osseux',
    ordre: 'Perciformes',
    vulnerabilityLevel: 'orange',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'poisson-clown',
    commonName: 'Poisson-clown',
    scientificName: 'Amphiprion ocellaris',
    embranchement: 'Chordés',
    classe: 'Poissons osseux',
    ordre: 'Perciformes',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'anguille-europeenne',
    commonName: 'Anguille européenne',
    scientificName: 'Anguilla anguilla',
    embranchement: 'Chordés',
    classe: 'Poissons osseux',
    ordre: 'Anguilliformes',
    vulnerabilityLevel: 'rouge',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'murene-commune',
    commonName: 'Murène commune',
    scientificName: 'Muraena helena',
    embranchement: 'Chordés',
    classe: 'Poissons osseux',
    ordre: 'Anguilliformes',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'tortue-caouanne',
    commonName: 'Tortue caouanne',
    scientificName: 'Caretta caretta',
    embranchement: 'Chordés',
    classe: 'Reptiles',
    ordre: 'Tortues marines',
    vulnerabilityLevel: 'orange',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'tortue-verte',
    commonName: 'Tortue verte',
    scientificName: 'Chelonia mydas',
    embranchement: 'Chordés',
    classe: 'Reptiles',
    ordre: 'Tortues marines',
    vulnerabilityLevel: 'orange',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'tortue-luth',
    commonName: 'Tortue luth',
    scientificName: 'Dermochelys coriacea',
    embranchement: 'Chordés',
    classe: 'Reptiles',
    ordre: 'Tortues marines',
    vulnerabilityLevel: 'rouge',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'pieuvre-commune',
    commonName: 'Pieuvre commune',
    scientificName: 'Octopus vulgaris',
    embranchement: 'Mollusques',
    classe: 'Céphalopodes',
    ordre: 'Pieuvres',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'pieuvre-geante-du-pacifique',
    commonName: 'Pieuvre géante du Pacifique',
    scientificName: 'Enteroctopus dofleini',
    embranchement: 'Mollusques',
    classe: 'Céphalopodes',
    ordre: 'Pieuvres',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'calmar-geant',
    commonName: 'Calmar géant',
    scientificName: 'Architeuthis dux',
    embranchement: 'Mollusques',
    classe: 'Céphalopodes',
    ordre: 'Calmars et seiches',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'seiche-commune',
    commonName: 'Seiche commune',
    scientificName: 'Sepia officinalis',
    embranchement: 'Mollusques',
    classe: 'Céphalopodes',
    ordre: 'Calmars et seiches',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'nudibranche-espagnol',
    commonName: 'Nudibranche espagnol',
    scientificName: 'Flabellina affinis',
    embranchement: 'Mollusques',
    classe: 'Gastéropodes',
    ordre: 'Nudibranches',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'doris-dalmatien',
    commonName: 'Doris dalmatien',
    scientificName: 'Peltodoris atromaculata',
    embranchement: 'Mollusques',
    classe: 'Gastéropodes',
    ordre: 'Nudibranches',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'corail-cerveau',
    commonName: 'Corail cerveau',
    scientificName: 'Diploria labyrinthiformis',
    embranchement: 'Cnidaires',
    classe: 'Anthozoaires',
    ordre: 'Coraux durs',
    vulnerabilityLevel: 'orange',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'corail-corne-delan',
    commonName: "Corail corne d'élan",
    scientificName: 'Acropora palmata',
    embranchement: 'Cnidaires',
    classe: 'Anthozoaires',
    ordre: 'Coraux durs',
    vulnerabilityLevel: 'rouge',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'meduse-boussole',
    commonName: 'Méduse boussole',
    scientificName: 'Chrysaora hysoscella',
    embranchement: 'Cnidaires',
    classe: 'Scyphozoaires',
    ordre: 'Méduses',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'meduse-lune',
    commonName: 'Méduse lune',
    scientificName: 'Aurelia aurita',
    embranchement: 'Cnidaires',
    classe: 'Scyphozoaires',
    ordre: 'Méduses',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'crabe-vert-europeen',
    commonName: 'Crabe vert européen',
    scientificName: 'Carcinus maenas',
    embranchement: 'Arthropodes',
    classe: 'Malacostracés',
    ordre: 'Crabes, crevettes et homards',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'homard-europeen',
    commonName: 'Homard européen',
    scientificName: 'Homarus gammarus',
    embranchement: 'Arthropodes',
    classe: 'Malacostracés',
    ordre: 'Crabes, crevettes et homards',
    vulnerabilityLevel: 'orange',
    imageUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 'crevette-bouquet',
    commonName: 'Crevette bouquet',
    scientificName: 'Palaemon serratus',
    embranchement: 'Arthropodes',
    classe: 'Malacostracés',
    ordre: 'Crabes, crevettes et homards',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
  },
];

@Service()
export class SpeciesService {
  private readonly taxonomyService = inject(TaxonomyService);

  /**
   * Looks up a single species by id.
   *
   * TODO: replace the fake data with an `httpResource` call to `/api/species/:id` once the
   * endpoint exists. Until then, it always resolves to the same fake species regardless of `id`,
   * so any species page can be previewed.
   */
  byId(id: () => string | undefined) {
    const value = computed(() => (id() ? FAKE_SPECIES_DETAIL : undefined));

    return {
      value,
      isLoading: signal(false).asReadonly(),
      error: signal(undefined).asReadonly(),
    };
  }

  /**
   * Lists species matching a search term and optional embranchement/classe/ordre filters.
   *
   * TODO: replace the fake data with an `httpResource` call to `/api/species` once the endpoint exists.
   */
  search(params: () => SpeciesSearchParams) {
    const value = computed(() => {
      const { term, embranchementId, classeId, ordreId } = params();
      const trimmedTerm = term.trim().toLowerCase();

      if (!trimmedTerm && !embranchementId && !classeId && !ordreId) {
        return [];
      }

      const embranchementNom = embranchementId
        ? this.taxonomyService.embranchements().find((embranchement) => embranchement.id === embranchementId)?.nom
        : undefined;
      const classeNom = classeId
        ? this.taxonomyService.classes(embranchementId).find((classe) => classe.id === classeId)?.nom
        : undefined;
      const ordreNom = ordreId
        ? this.taxonomyService.ordres(embranchementId, classeId).find((ordre) => ordre.id === ordreId)?.nom
        : undefined;

      return FAKE_SPECIES.filter((species) => {
        const matchesTerm =
          !trimmedTerm ||
          species.commonName.toLowerCase().includes(trimmedTerm) ||
          species.scientificName.toLowerCase().includes(trimmedTerm);
        const matchesEmbranchement = !embranchementNom || species.embranchement === embranchementNom;
        const matchesClasse = !classeNom || species.classe === classeNom;
        const matchesOrdre = !ordreNom || species.ordre === ordreNom;
        return matchesTerm && matchesEmbranchement && matchesClasse && matchesOrdre;
      });
    });

    return {
      value,
      isLoading: signal(false).asReadonly(),
      error: signal(undefined).asReadonly(),
    };
  }

  /**
   * Lists the most recently added species.
   *
   * TODO: replace the fake data with an `httpResource` call to `/api/species/latest` once the endpoint exists.
   */
  latest(limit = 8) {
    return {
      value: signal(FAKE_SPECIES.slice(0, limit)).asReadonly(),
      isLoading: signal(false).asReadonly(),
      error: signal(undefined).asReadonly(),
    };
  }
}
