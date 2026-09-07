import { Component, computed, ElementRef, inject, input, model, signal } from '@angular/core';

export interface AutocompleteOption {
  id: string;
  nom: string;
}

const MAX_VISIBLE_CHIPS = 3;

@Component({
  selector: 'app-multi-select-autocomplete',
  templateUrl: './multi-select-autocomplete.component.html',
  styleUrl: './multi-select-autocomplete.component.scss',
})
export class MultiSelectAutocomplete {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly inputId = input.required<string>();
  readonly label = input.required<string>();
  readonly options = input.required<AutocompleteOption[]>();
  readonly placeholder = input('Rechercher…');

  readonly selectedIds = model<string[]>([]);

  protected readonly searchTerm = signal('');
  protected readonly focused = signal(false);

  protected readonly showOptions = computed(() => this.focused());

  protected readonly effectivePlaceholder = computed(() =>
    this.selectedIds().length > 0 ? '' : this.placeholder(),
  );

  protected readonly selectedOptions = computed(() => {
    const ids = this.selectedIds();
    return this.options().filter((option) => ids.includes(option.id));
  });

  protected readonly visibleChips = computed(() => this.selectedOptions().slice(0, MAX_VISIBLE_CHIPS));

  protected readonly extraCount = computed(() => this.selectedOptions().length - MAX_VISIBLE_CHIPS);

  protected readonly extraNames = computed(() =>
    this.selectedOptions()
      .slice(MAX_VISIBLE_CHIPS)
      .map((option) => option.nom)
      .join(', '),
  );

  protected readonly filteredOptions = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.options();
    }
    return this.options().filter((option) => option.nom.toLowerCase().includes(term));
  });

  protected onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  protected onFocusIn(): void {
    this.focused.set(true);
  }

  protected onFocusOut(event: FocusEvent): void {
    const nextFocusTarget = event.relatedTarget as Node | null;
    if (nextFocusTarget && this.elementRef.nativeElement.contains(nextFocusTarget)) {
      // Focus moved to something else inside this widget (e.g. an option checkbox) — not a real blur.
      return;
    }
    this.focused.set(false);
    this.searchTerm.set('');
  }

  protected onEscape(event: Event): void {
    (event.target as HTMLInputElement).blur();
  }

  protected isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  protected onToggle(id: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedIds().includes(id)) {
        this.selectedIds.set([...this.selectedIds(), id]);
      }
    } else {
      this.removeSelected(id);
    }
  }

  protected removeSelected(id: string): void {
    this.selectedIds.set(this.selectedIds().filter((selectedId) => selectedId !== id));
  }

  protected clearSelection(): void {
    this.selectedIds.set([]);
  }
}
