import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { SpeciesService } from '../species.service';
import { VULNERABILITY_LABELS } from '../species.model';

@Component({
  selector: 'app-species-detail',
  imports: [NgOptimizedImage],
  templateUrl: './species-detail.component.html',
  styleUrl: './species-detail.component.scss',
})
export class SpeciesDetail {
  /** Bound from the `:id` route param via `withComponentInputBinding()`. */
  readonly id = input.required<string>();

  private readonly speciesService = inject(SpeciesService);

  protected readonly species = this.speciesService.byId(this.id);

  protected readonly chips = computed(() => {
    const currentSpecies = this.species.value();
    if (!currentSpecies) {
      return [];
    }

    return [
      {
        label: VULNERABILITY_LABELS[currentSpecies.vulnerabilityLevel],
        tone: currentSpecies.vulnerabilityLevel,
      },
    ];
  });
}
