/** Species vulnerability, on a 3-level scale. */
export type VulnerabilityLevel = 'rouge' | 'orange' | 'vert';

export const VULNERABILITY_LABELS: Record<VulnerabilityLevel, string> = {
  rouge: 'En danger',
  orange: 'Vulnérable',
  vert: 'Préoccupation mineure',
};

/** A marine species as returned by the API. */
export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  embranchement: string;
  classe: string;
  ordre: string;
  vulnerabilityLevel: VulnerabilityLevel;
  description?: string;
  habitat?: string;
  imageUrl?: string;
  distributionMapUrl?: string;
}
