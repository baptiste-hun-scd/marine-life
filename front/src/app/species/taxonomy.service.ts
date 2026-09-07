import { Service, signal } from '@angular/core';
import { Classe, Embranchement, Ordre, Taxonomy } from './taxonomy.model';

/**
 * Fake taxonomic classification tree, standing in until the backend endpoint exists.
 */
const FAKE_TAXONOMY: Taxonomy = [
  {
    id: 'chordata',
    nom: 'Chordés',
    classes: [
      {
        id: 'mammalia',
        nom: 'Mammifères',
        ordres: [
          { id: 'cetacea', nom: 'Cétacés' },
          { id: 'carnivora', nom: 'Carnivores' },
        ],
      },
      {
        id: 'chondrichthyes',
        nom: 'Poissons cartilagineux',
        ordres: [
          { id: 'carcharhiniformes', nom: 'Requins' },
          { id: 'rajiformes', nom: 'Raies' },
        ],
      },
      {
        id: 'actinopterygii',
        nom: 'Poissons osseux',
        ordres: [
          { id: 'perciformes', nom: 'Perciformes' },
          { id: 'anguilliformes', nom: 'Anguilliformes' },
        ],
      },
      {
        id: 'reptilia',
        nom: 'Reptiles',
        ordres: [{ id: 'testudines', nom: 'Tortues marines' }],
      },
    ],
  },
  {
    id: 'mollusca',
    nom: 'Mollusques',
    classes: [
      {
        id: 'cephalopoda',
        nom: 'Céphalopodes',
        ordres: [
          { id: 'octopoda', nom: 'Pieuvres' },
          { id: 'decapodiformes', nom: 'Calmars et seiches' },
        ],
      },
      {
        id: 'gastropoda',
        nom: 'Gastéropodes',
        ordres: [{ id: 'nudibranchia', nom: 'Nudibranches' }],
      },
    ],
  },
  {
    id: 'cnidaria',
    nom: 'Cnidaires',
    classes: [
      {
        id: 'anthozoa',
        nom: 'Anthozoaires',
        ordres: [{ id: 'scleractinia', nom: 'Coraux durs' }],
      },
      {
        id: 'scyphozoa',
        nom: 'Scyphozoaires',
        ordres: [{ id: 'semaeostomeae', nom: 'Méduses' }],
      },
    ],
  },
  {
    id: 'arthropoda',
    nom: 'Arthropodes',
    classes: [
      {
        id: 'malacostraca',
        nom: 'Malacostracés',
        ordres: [{ id: 'decapoda', nom: 'Crabes, crevettes et homards' }],
      },
    ],
  },
];

/**
 * Serves the taxonomic classification tree (embranchement -> classes -> ordres).
 *
 * The data is static, so a single value is held by this singleton service,
 * shared by every consumer, acting as an in-memory cache.
 *
 * TODO: replace the fake data with an `httpResource` call to `/api/taxonomy` once the endpoint exists.
 */
@Service()
export class TaxonomyService {
  readonly tree = signal<Taxonomy>(FAKE_TAXONOMY).asReadonly();

  embranchements(): Embranchement[] {
    return this.tree();
  }

  /** Classes of the given embranchements, or every class of every embranchement when none is selected. */
  classes(embranchementIds: string[] | undefined): Classe[] {
    if (!embranchementIds?.length) {
      return this.embranchements().flatMap((embranchement) => embranchement.classes);
    }
    return this.embranchements()
      .filter((embranchement) => embranchementIds.includes(embranchement.id))
      .flatMap((embranchement) => embranchement.classes);
  }

  /** Orders of the given classes, or every order in scope (see `classes`) when none is selected. */
  ordres(embranchementIds: string[] | undefined, classeIds: string[] | undefined): Ordre[] {
    const classes = this.classes(embranchementIds);
    if (!classeIds?.length) {
      return classes.flatMap((classe) => classe.ordres);
    }
    return classes.filter((classe) => classeIds.includes(classe.id)).flatMap((classe) => classe.ordres);
  }
}
