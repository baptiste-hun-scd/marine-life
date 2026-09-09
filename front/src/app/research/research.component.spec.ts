import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Species } from '../species/species.model';
import { SpeciesSearchParams, SpeciesService } from '../species/species.service';
import { Embranchement } from '../species/taxonomy.model';
import { TaxonomyService } from '../species/taxonomy.service';
import { Research } from './research.component';

const TAXONOMY: Embranchement[] = [
  {
    id: 'chordata',
    nom: 'Chordés',
    classes: [{ id: 'mammalia', nom: 'Mammifères', ordres: [{ id: 'cetacea', nom: 'Cétacés' }] }],
  },
  {
    id: 'mollusca',
    nom: 'Mollusques',
    classes: [
      { id: 'cephalopoda', nom: 'Céphalopodes', ordres: [{ id: 'octopoda', nom: 'Pieuvres' }] },
    ],
  },
];

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

function classesOf(embranchementIds?: string[]): Embranchement['classes'] {
  return !embranchementIds?.length
    ? TAXONOMY.flatMap((e) => e.classes)
    : TAXONOMY.filter((e) => embranchementIds.includes(e.id)).flatMap((e) => e.classes);
}

/** Opens a `MultiSelectAutocomplete` widget's option list by focusing its input. */
async function openWidget(
  fixture: ComponentFixture<Research>,
  root: HTMLElement,
  inputId: string,
): Promise<HTMLElement> {
  const input = root.querySelector(`#${inputId}`) as HTMLInputElement;
  input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
  await fixture.whenStable();
  return input.closest('.wrapper') as HTMLElement;
}

/** Ticks the checkbox for the option named `optionNom` inside the given widget. */
async function selectOption(
  fixture: ComponentFixture<Research>,
  root: HTMLElement,
  inputId: string,
  optionNom: string,
): Promise<void> {
  const wrapper = await openWidget(fixture, root, inputId);
  const option = Array.from(wrapper.querySelectorAll('.option')).find((el) =>
    el.textContent?.trim().includes(optionNom),
  );
  (option?.querySelector('input[type="checkbox"]') as HTMLInputElement).click();
  await fixture.whenStable();
}

async function optionNames(
  fixture: ComponentFixture<Research>,
  root: HTMLElement,
  inputId: string,
): Promise<(string | undefined)[]> {
  const wrapper = await openWidget(fixture, root, inputId);
  return Array.from(wrapper.querySelectorAll('.option')).map((el) => el.textContent?.trim());
}

describe('Research', () => {
  let fixture: ComponentFixture<Research>;
  let root: HTMLElement;
  let latestValue: ReturnType<typeof signal<Species[]>>;
  let fakeSpeciesService: { search: ReturnType<typeof vi.fn>; latest: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    latestValue = signal<Species[]>([buildSpecies('grand-dauphin'), buildSpecies('baleine-bleue')]);

    fakeSpeciesService = {
      search: vi.fn(() => ({
        value: signal<Species[]>([]),
        isLoading: signal(false),
        error: signal(undefined),
      })),
      latest: vi.fn(() => ({
        value: latestValue,
        isLoading: signal(false),
        error: signal(undefined),
      })),
    };

    const fakeTaxonomyService: Pick<TaxonomyService, 'embranchements' | 'classes' | 'ordres'> = {
      embranchements: () => TAXONOMY,
      classes: (embranchementIds) => classesOf(embranchementIds),
      ordres: (embranchementIds, classeIds) => {
        const classes = classesOf(embranchementIds);
        return !classeIds?.length
          ? classes.flatMap((c) => c.ordres)
          : classes.filter((c) => classeIds.includes(c.id)).flatMap((c) => c.ordres);
      },
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: SpeciesService, useValue: fakeSpeciesService },
        { provide: TaxonomyService, useValue: fakeTaxonomyService },
      ],
    });

    fixture = TestBed.createComponent(Research);
    await fixture.whenStable();
    root = fixture.nativeElement as HTMLElement;
  });

  it('shows the latest species by default', () => {
    expect(root.textContent).toContain('Derniers ajouts');
    expect(root.querySelectorAll('.species-grid li')).toHaveLength(2);
  });

  it('lists every embranchement as a filter option', async () => {
    expect(await optionNames(fixture, root, 'filter-embranchement')).toEqual([
      'Chordés',
      'Mollusques',
    ]);
  });

  it('switches to the search results as soon as the user types a term', async () => {
    const input = root.querySelector('#species-search') as HTMLInputElement;
    input.value = 'orque';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(root.textContent).toContain('Résultats de la recherche');
    expect(root.textContent).not.toContain('Derniers ajouts');
  });

  it('debounces the typed term before it reaches the search query', async () => {
    const paramsFn = fakeSpeciesService.search.mock.calls[0][0] as () => SpeciesSearchParams;
    const input = root.querySelector('#species-search') as HTMLInputElement;

    input.value = 'req';
    input.dispatchEvent(new Event('input'));

    // Well before the debounce delay: the query hasn't reached the search params yet.
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(paramsFn().term).toBe('');

    // Comfortably past the debounce delay: it has landed by now.
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(paramsFn().term).toBe('req');
  });

  it('narrows the classe filter options to the selected embranchement', async () => {
    await selectOption(fixture, root, 'filter-embranchement', 'Mollusques');

    expect(await optionNames(fixture, root, 'filter-classe')).toEqual(['Céphalopodes']);
  });

  it('resets the classe and ordre selections when the embranchement changes', async () => {
    await selectOption(fixture, root, 'filter-classe', 'Mammifères');
    await selectOption(fixture, root, 'filter-ordre', 'Cétacés');

    await selectOption(fixture, root, 'filter-embranchement', 'Mollusques');

    // Had the classe/ordre selections not been reset, they'd still be scoped to the
    // now-deselected "Chordés" branch and no ordre would match here.
    expect(await optionNames(fixture, root, 'filter-ordre')).toEqual(['Pieuvres']);
  });

  it('clears every filter and goes back to "Derniers ajouts" on reset', async () => {
    const input = root.querySelector('#species-search') as HTMLInputElement;
    input.value = 'orque';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(root.textContent).toContain('Résultats de la recherche');

    const resetButton = Array.from(root.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Réinitialiser',
    ) as HTMLButtonElement;
    resetButton.click();
    await fixture.whenStable();

    expect(input.value).toBe('');
    expect(root.textContent).toContain('Derniers ajouts');
  });
});
