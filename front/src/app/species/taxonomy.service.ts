import { httpResource } from '@angular/common/http';
import { computed, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Classe, Embranchement, Ordre, Taxonomy } from './taxonomy.model';

/**
 * Serves the taxonomic classification tree (embranchement -> classes -> ordres).
 *
 * The data is static, so a single value is held by this singleton service,
 * shared by every consumer, acting as an in-memory cache.
 */
@Service()
export class TaxonomyService {
  private readonly treeResource = httpResource<Taxonomy>(() => `${environment.apiUrl}/taxonomy`, {
    defaultValue: [],
  });

  readonly tree = computed(() => this.treeResource.value());

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
