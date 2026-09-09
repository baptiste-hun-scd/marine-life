import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutocompleteOption, MultiSelectAutocomplete } from './multi-select-autocomplete.component';

const OPTIONS: AutocompleteOption[] = [
  { id: 'a', nom: 'Alpha' },
  { id: 'b', nom: 'Beta' },
  { id: 'c', nom: 'Gamma' },
  { id: 'd', nom: 'Delta' },
];

describe('MultiSelectAutocomplete', () => {
  let fixture: ComponentFixture<MultiSelectAutocomplete>;
  let component: MultiSelectAutocomplete;
  let root: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(MultiSelectAutocomplete);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('inputId', 'filter-test');
    fixture.componentRef.setInput('label', 'Filtre');
    fixture.componentRef.setInput('options', OPTIONS);
    await fixture.whenStable();
    root = fixture.nativeElement as HTMLElement;
  });

  function input(): HTMLInputElement {
    return root.querySelector('#filter-test') as HTMLInputElement;
  }

  function optionCheckbox(nom: string): HTMLInputElement {
    const option = Array.from(root.querySelectorAll('.option')).find((el) =>
      el.textContent?.trim().includes(nom),
    );
    return option?.querySelector('input[type="checkbox"]') as HTMLInputElement;
  }

  it('renders the label and placeholder', () => {
    expect(root.querySelector('label')?.textContent).toContain('Filtre');
    expect(input().placeholder).toBe('Rechercher…');
  });

  it('hides the options list until the input is focused', async () => {
    expect(root.querySelector('.options')).toBeFalsy();

    input().dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await fixture.whenStable();

    expect(root.querySelectorAll('.options .option')).toHaveLength(OPTIONS.length);
  });

  it('filters the options as the user types', async () => {
    input().dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    input().value = 'al';
    input().dispatchEvent(new Event('input'));
    await fixture.whenStable();

    const labels = Array.from(root.querySelectorAll('.options .option')).map((el) =>
      el.textContent?.trim(),
    );
    expect(labels).toEqual(['Alpha']);
  });

  it('shows a fallback message when no option matches the search term', async () => {
    input().dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    input().value = 'zzz';
    input().dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(root.querySelector('.empty')?.textContent).toContain('Aucun résultat');
  });

  it('selects an option and shows it as a chip', async () => {
    input().dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await fixture.whenStable();

    optionCheckbox('Alpha').click();
    await fixture.whenStable();

    expect(component.selectedIds()).toEqual(['a']);
    expect(root.querySelector('.chip')?.textContent).toContain('Alpha');
  });

  it('removes a selection when its chip remove button is clicked', async () => {
    component.selectedIds.set(['a']);
    await fixture.whenStable();

    (root.querySelector('.chip-remove') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(component.selectedIds()).toEqual([]);
    expect(root.querySelector('.chip')).toBeFalsy();
  });

  it('caps visible chips and summarizes the rest as "+N"', async () => {
    component.selectedIds.set(['a', 'b', 'c', 'd']);
    await fixture.whenStable();

    expect(root.querySelectorAll('.chip')).toHaveLength(4);
    expect(root.querySelector('.chip--more')?.textContent).toContain('+1');
  });

  it('clears the whole selection when the clear button is clicked', async () => {
    component.selectedIds.set(['a', 'b']);
    await fixture.whenStable();

    (root.querySelector('.clear-button') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(component.selectedIds()).toEqual([]);
  });

  it('closes the options list and clears the search term on blur outside the widget', async () => {
    input().dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    input().value = 'al';
    input().dispatchEvent(new Event('input'));
    await fixture.whenStable();

    input().dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }),
    );
    await fixture.whenStable();

    expect(root.querySelector('.options')).toBeFalsy();
    expect(input().value).toBe('');
  });

  it('keeps the options list open when focus moves to something inside the widget', async () => {
    input().dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await fixture.whenStable();

    const checkbox = optionCheckbox('Alpha');
    input().dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: checkbox }));
    await fixture.whenStable();

    expect(root.querySelector('.options')).toBeTruthy();
  });

  it('blurs the input on Escape', () => {
    const blurSpy = vi.fn();
    input().addEventListener('blur', blurSpy);
    input().focus();

    input().dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );

    expect(blurSpy).toHaveBeenCalledTimes(1);
  });
});
