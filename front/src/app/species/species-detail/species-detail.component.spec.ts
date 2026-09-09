import { Location } from '@angular/common';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Species } from '../species.model';
import { SpeciesService } from '../species.service';
import { SpeciesDetail } from './species-detail.component';

function buildSpecies(overrides: Partial<Species> = {}): Species {
  return {
    id: 'grand-dauphin',
    commonName: 'Grand dauphin',
    scientificName: 'Tursiops truncatus',
    embranchement: 'Chordés',
    classe: 'Mammifères',
    ordre: 'Cétacés',
    vulnerabilityLevel: 'rouge',
    description: 'Une description.',
    habitat: 'Eaux côtières.',
    imageUrl: 'https://picsum.photos/1200/675',
    distributionMapUrl: 'https://picsum.photos/800/400',
    ...overrides,
  };
}

describe('SpeciesDetail', () => {
  let fixture: ComponentFixture<SpeciesDetail>;
  let valueSignal: ReturnType<typeof signal<Species | undefined>>;
  let isLoadingSignal: ReturnType<typeof signal<boolean>>;
  let errorSignal: ReturnType<typeof signal<unknown>>;
  let goBack: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    valueSignal = signal<Species | undefined>(undefined);
    isLoadingSignal = signal(false);
    errorSignal = signal<unknown>(undefined);
    goBack = vi.fn();

    const fakeSpeciesService = {
      byId: vi.fn(() => ({ value: valueSignal, isLoading: isLoadingSignal, error: errorSignal })),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: SpeciesService, useValue: fakeSpeciesService },
        { provide: Location, useValue: { back: goBack } },
      ],
    });

    fixture = TestBed.createComponent(SpeciesDetail);
    fixture.componentRef.setInput('id', 'grand-dauphin');
  });

  it('shows a loading message while the species is loading', async () => {
    isLoadingSignal.set(true);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Chargement de la fiche espèce…',
    );
  });

  it('shows an error message, as an alert, when the request fails', async () => {
    errorSignal.set(new Error('boom'));
    await fixture.whenStable();

    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Impossible de charger cette espèce.');
  });

  it('shows a not-found message when there is no error but no species either', async () => {
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Espèce introuvable.');
  });

  it('renders the species hero, description, taxonomy and vulnerability chip', async () => {
    valueSignal.set(buildSpecies());
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    const taxonomy = el.querySelectorAll('.taxonomy dd');

    expect(el.querySelector('.hero-title')?.textContent).toContain('Grand dauphin');
    expect(el.querySelector('.hero-subtitle')?.textContent).toContain('Tursiops truncatus');
    expect(el.querySelector('.description')?.textContent).toContain('Une description.');
    expect(taxonomy[2].textContent).toContain('Chordés');
    expect(taxonomy[3].textContent).toContain('Mammifères');
    expect(taxonomy[4].textContent).toContain('Cétacés');
    expect(el.querySelector('.distribution-habitat')?.textContent).toContain('Eaux côtières.');

    const chip = el.querySelector('.hero-chips .glob-chip');
    expect(chip?.textContent).toContain('En danger');
    expect(chip?.classList.contains('glob-chip--danger')).toBe(true);
  });

  it('falls back to placeholder copy when optional fields are missing', async () => {
    valueSignal.set(
      buildSpecies({
        description: undefined,
        habitat: undefined,
        distributionMapUrl: undefined,
        imageUrl: undefined,
      }),
    );
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.description')?.textContent).toContain(
      'Aucune description disponible pour le moment.',
    );
    expect(el.textContent).toContain('Carte de répartition non disponible pour le moment.');
    expect(el.querySelector('.hero-image--placeholder')).toBeTruthy();
  });

  it('navigates back when the back button is clicked', async () => {
    valueSignal.set(buildSpecies());
    await fixture.whenStable();

    (fixture.nativeElement.querySelector('.back-button') as HTMLButtonElement).click();

    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
