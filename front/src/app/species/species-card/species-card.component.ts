import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Species, VULNERABILITY_LABELS } from '../species.model';

@Component({
  selector: 'app-species-card',
  imports: [NgOptimizedImage],
  templateUrl: './species-card.component.html',
  styleUrl: './species-card.component.scss',
})
export class SpeciesCard {
  readonly species = input.required<Species>();

  protected readonly vulnerabilityLabel = computed(() => VULNERABILITY_LABELS[this.species().vulnerabilityLevel]);
}
