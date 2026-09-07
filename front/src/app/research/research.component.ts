import { Component, computed, inject, signal } from '@angular/core';
import { MultiSelectAutocomplete } from '../shared/multi-select-autocomplete/multi-select-autocomplete.component';
import { SpeciesService } from '../species/species.service';
import { TaxonomyService } from '../species/taxonomy.service';
import { SpeciesResultsSection } from './species-results-section/species-results-section.component';

@Component({
  selector: 'app-research',
  imports: [MultiSelectAutocomplete, SpeciesResultsSection],
  templateUrl: './research.component.html',
  styleUrl: './research.component.scss',
})
export class Research {
  private readonly speciesService = inject(SpeciesService);
  private readonly taxonomyService = inject(TaxonomyService);

  protected readonly query = signal('');
  protected readonly selectedEmbranchementIds = signal<string[]>([]);
  protected readonly selectedClasseIds = signal<string[]>([]);
  protected readonly selectedOrdreIds = signal<string[]>([]);

  protected readonly embranchements = computed(() => this.taxonomyService.embranchements());
  protected readonly classes = computed(() => this.taxonomyService.classes(this.selectedEmbranchementIds()));
  protected readonly ordres = computed(() =>
    this.taxonomyService.ordres(this.selectedEmbranchementIds(), this.selectedClasseIds()),
  );

  protected readonly hasActiveFilters = computed(
    () =>
      !!this.query().trim() ||
      this.selectedEmbranchementIds().length > 0 ||
      this.selectedClasseIds().length > 0 ||
      this.selectedOrdreIds().length > 0,
  );

  protected readonly results = this.speciesService.search(() => ({
    term: this.query(),
    embranchementIds: this.selectedEmbranchementIds(),
    classeIds: this.selectedClasseIds(),
    ordreIds: this.selectedOrdreIds(),
  }));

  protected readonly latestSpecies = this.speciesService.latest();

  protected onQueryInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected onEmbranchementChange(ids: string[]): void {
    this.selectedEmbranchementIds.set(ids);
    this.selectedClasseIds.set([]);
    this.selectedOrdreIds.set([]);
  }

  protected onClasseChange(ids: string[]): void {
    this.selectedClasseIds.set(ids);
    this.selectedOrdreIds.set([]);
  }

  protected onOrdreChange(ids: string[]): void {
    this.selectedOrdreIds.set(ids);
  }

  protected onReset(): void {
    this.query.set('');
    this.selectedEmbranchementIds.set([]);
    this.selectedClasseIds.set([]);
    this.selectedOrdreIds.set([]);
  }
}
