import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SpeciesCard } from '../../species/species-card/species-card.component';
import { Species } from '../../species/species.model';

@Component({
  selector: 'app-species-results-section',
  imports: [RouterLink, SpeciesCard],
  templateUrl: './species-results-section.component.html',
  styleUrl: './species-results-section.component.scss',
})
export class SpeciesResultsSection {
  readonly headingId = input.required<string>();
  readonly heading = input.required<string>();
  readonly speciesList = input.required<Species[]>();
  readonly isLoading = input.required<boolean>();
  readonly hasError = input.required<boolean>();
  readonly loadingMessage = input.required<string>();
  readonly errorMessage = input.required<string>();
  readonly emptyMessage = input.required<string>();
}
