import { Component, computed, inject, signal } from '@angular/core';
import { SpeciesService } from '../species/species.service';
import { TaxonomyService } from '../species/taxonomy.service';
import { SpeciesResultsSection } from './species-results-section/species-results-section.component';

@Component({
  selector: 'app-research',
  imports: [SpeciesResultsSection],
  templateUrl: './research.component.html',
  styleUrl: './research.component.scss',
})
export class Research {
  private readonly speciesService = inject(SpeciesService);
  private readonly taxonomyService = inject(TaxonomyService);

  protected readonly query = signal('');
  protected readonly selectedEmbranchementId = signal('');
  protected readonly selectedClasseId = signal('');
  protected readonly selectedOrdreId = signal('');

  protected readonly embranchements = computed(() => this.taxonomyService.embranchements());
  protected readonly classes = computed(() =>
    this.taxonomyService.classes(this.selectedEmbranchementId() || undefined),
  );
  protected readonly ordres = computed(() =>
    this.taxonomyService.ordres(this.selectedEmbranchementId() || undefined, this.selectedClasseId() || undefined),
  );

  protected readonly hasActiveFilters = computed(
    () =>
      !!this.query().trim() ||
      !!this.selectedEmbranchementId() ||
      !!this.selectedClasseId() ||
      !!this.selectedOrdreId(),
  );

  protected readonly results = this.speciesService.search(() => ({
    term: this.query(),
    embranchementId: this.selectedEmbranchementId() || undefined,
    classeId: this.selectedClasseId() || undefined,
    ordreId: this.selectedOrdreId() || undefined,
  }));

  protected readonly latestSpecies = this.speciesService.latest();

  protected onQueryInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected onEmbranchementChange(event: Event): void {
    this.selectedEmbranchementId.set((event.target as HTMLSelectElement).value);
    this.selectedClasseId.set('');
    this.selectedOrdreId.set('');
  }

  protected onClasseChange(event: Event): void {
    this.selectedClasseId.set((event.target as HTMLSelectElement).value);
    this.selectedOrdreId.set('');
  }

  protected onOrdreChange(event: Event): void {
    this.selectedOrdreId.set((event.target as HTMLSelectElement).value);
  }

  protected onReset(): void {
    this.query.set('');
    this.selectedEmbranchementId.set('');
    this.selectedClasseId.set('');
    this.selectedOrdreId.set('');
  }
}
