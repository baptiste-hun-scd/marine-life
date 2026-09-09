import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Species } from '../../species/species.model';
import { SpeciesResultsSection } from './species-results-section.component';

function buildSpecies(id: string): Species {
  return {
    id,
    commonName: `Espèce ${id}`,
    scientificName: `Species ${id}`,
    embranchement: 'Chordés',
    classe: 'Mammifères',
    ordre: 'Cétacés',
    vulnerabilityLevel: 'vert',
  };
}

describe('SpeciesResultsSection', () => {
  let fixture: ComponentFixture<SpeciesResultsSection>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(SpeciesResultsSection);
    fixture.componentRef.setInput('headingId', 'results-heading');
    fixture.componentRef.setInput('heading', 'Résultats');
    fixture.componentRef.setInput('loadingMessage', 'Chargement…');
    fixture.componentRef.setInput('errorMessage', 'Une erreur est survenue.');
    fixture.componentRef.setInput('emptyMessage', 'Aucun résultat.');
  });

  it('shows the loading message while loading', async () => {
    fixture.componentRef.setInput('speciesList', []);
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('hasError', false);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Chargement…');
  });

  it('shows the error message, as an alert, when the request failed', async () => {
    fixture.componentRef.setInput('speciesList', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('hasError', true);
    await fixture.whenStable();

    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Une erreur est survenue.');
  });

  it('shows the empty message when there are no results', async () => {
    fixture.componentRef.setInput('speciesList', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('hasError', false);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Aucun résultat.');
  });

  it('renders a linked card for each species', async () => {
    fixture.componentRef.setInput('speciesList', [buildSpecies('a'), buildSpecies('b')]);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('hasError', false);
    await fixture.whenStable();

    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('a');
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('href')).toBe('/species/a');
    expect(links[1].getAttribute('href')).toBe('/species/b');
    expect(links[0].querySelector('app-species-card')).toBeTruthy();
  });
});
