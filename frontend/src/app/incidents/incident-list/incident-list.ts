import {
  Component,
  computed,
  inject,
  input,
  signal
} from '@angular/core';

import { IncidentCard } from '../incident-card/incident-card';
import { Incident } from '../../models/incident';
import { IncidentService } from '../../services/incident';

@Component({
  selector: 'app-incident-list',
  imports: [IncidentCard],
  templateUrl: './incident-list.html',
  styleUrl: './incident-list.css'
})
export class IncidentList {
  private incidentService =
    inject(IncidentService);

  incidents =
    input.required<Incident[]>();

  searchTerm =
    signal('');

  filteredIncidents =
    computed(() => {
      const search =
        this.searchTerm()
          .trim()
          .toLowerCase();

      return this.incidents().filter(
        (incident) =>
          incident.title
            .toLowerCase()
            .includes(search)
      );
    });

  handleSearch(event: Event): void {
    const input =
      event.target as HTMLInputElement;

    this.searchTerm.set(input.value);
  }

  handleResolve(id: string): void {
    this.incidentService
      .resolveIncident(id)
      .subscribe();
  }

  handleDelete(id: string): void {
    const confirmed =
      window.confirm(
        'Delete this incident?'
      );

    if (!confirmed) {
      return;
    }

    this.incidentService
      .deleteIncident(id)
      .subscribe();
  }
}