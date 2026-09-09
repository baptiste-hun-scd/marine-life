import { httpResource } from '@angular/common/http';
import { Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Species } from './species.model';

export interface SpeciesSearchParams {
  term: string;
  embranchementIds?: string[];
  classeIds?: string[];
  ordreIds?: string[];
}

@Service()
export class SpeciesService {
  /** Looks up a single species by id via `GET /api/species/:id`. */
  byId(id: () => string | undefined) {
    return httpResource<Species>(() => {
      const value = id();
      return value ? `${environment.apiUrl}/species/${value}` : undefined;
    });
  }

  /**
   * Lists species matching a search term and optional embranchement/classe/ordre filters, via
   * `GET /api/species`. Skips the request entirely while no term or filter is set.
   */
  search(params: () => SpeciesSearchParams) {
    return httpResource<Species[]>(
      () => {
        const { term, embranchementIds, classeIds, ordreIds } = params();
        const trimmedTerm = term.trim();

        if (!trimmedTerm && !embranchementIds?.length && !classeIds?.length && !ordreIds?.length) {
          return undefined;
        }

        const queryParams: Record<string, string | readonly string[]> = {};
        if (trimmedTerm) {
          queryParams['term'] = trimmedTerm;
        }
        if (embranchementIds?.length) {
          queryParams['embranchementIds'] = embranchementIds;
        }
        if (classeIds?.length) {
          queryParams['classeIds'] = classeIds;
        }
        if (ordreIds?.length) {
          queryParams['ordreIds'] = ordreIds;
        }

        return { url: `${environment.apiUrl}/species`, params: queryParams };
      },
      { defaultValue: [] },
    );
  }

  /** Lists the most recently added species via `GET /api/species/latest`. */
  latest(limit = 8) {
    return httpResource<Species[]>(
      () => ({ url: `${environment.apiUrl}/species/latest`, params: { limit } }),
      { defaultValue: [] },
    );
  }
}
