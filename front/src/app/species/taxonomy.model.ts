/** A taxonomic order (ordre). */
export interface Ordre {
  id: string;
  nom: string;
}

/** A taxonomic class (classe), grouping orders. */
export interface Classe {
  id: string;
  nom: string;
  ordres: Ordre[];
}

/** A taxonomic phylum (embranchement), grouping classes. */
export interface Embranchement {
  id: string;
  nom: string;
  classes: Classe[];
}

/** Static taxonomic classification tree used to filter species. */
export type Taxonomy = Embranchement[];
