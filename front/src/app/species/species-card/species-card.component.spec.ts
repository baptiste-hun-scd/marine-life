import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Species } from '../species.model';
import { SpeciesCard } from './species-card.component';

function buildSpecies(overrides: Partial<Species> = {}): Species {
  return {
    id: 'grand-dauphin',
    commonName: 'Grand dauphin',
    scientificName: 'Tursiops truncatus',
    embranchement: 'Chordés',
    classe: 'Mammifères',
    ordre: 'Cétacés',
    vulnerabilityLevel: 'vert',
    imageUrl: 'https://picsum.photos/200/300',
    ...overrides,
  };
}

describe('SpeciesCard', () => {
  let fixture: ComponentFixture<SpeciesCard>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SpeciesCard);
  });

  it('renders the species names, taxonomy and image', async () => {
    fixture.componentRef.setInput('species', buildSpecies());
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    const taxonomy = el.querySelectorAll('.taxonomy dd');

    expect(el.querySelector('.title')?.textContent).toContain('Tursiops truncatus');
    expect(el.querySelector('.subtitle')?.textContent).toContain('Grand dauphin');
    expect(taxonomy[0].textContent).toContain('Chordés');
    expect(taxonomy[1].textContent).toContain('Mammifères');
    expect(taxonomy[2].textContent).toContain('Cétacés');
    expect(el.querySelector('img.media-image')).toBeTruthy();
    expect(el.querySelector('.media-image--placeholder')).toBeFalsy();
  });

  it('renders a placeholder when the species has no image', async () => {
    fixture.componentRef.setInput('species', buildSpecies({ imageUrl: undefined }));
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('img.media-image')).toBeFalsy();
    expect(el.querySelector('.media-image--placeholder')).toBeTruthy();
  });

  it.each([
    ['vert', 'Préoccupation mineure', 'safe'],
    ['orange', 'Vulnérable', 'warning'],
    ['rouge', 'En danger', 'danger'],
  ] as const)(
    'renders the "%s" vulnerability level as "%s" with the %s tone',
    async (level, label, tone) => {
      fixture.componentRef.setInput('species', buildSpecies({ vulnerabilityLevel: level }));
      await fixture.whenStable();

      const callout = (fixture.nativeElement as HTMLElement).querySelector('.glob-callout');
      expect(callout?.textContent).toContain(label);
      expect(callout?.classList.contains(`glob-callout--${tone}`)).toBe(true);
    },
  );
});
