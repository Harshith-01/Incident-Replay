import {
  Component,
  computed,
  inject
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { IncidentList } from '../../incidents/incident-list/incident-list';
import { IncidentService } from '../../services/incident';

@Component({
  selector: 'app-incidents',
  imports: [
    RouterLink,
    IncidentList
  ],
  templateUrl: './incidents.html',
  styleUrl: './incidents.css'
})
export class Incidents {
  private route = inject(ActivatedRoute);
  private incidentService = inject(IncidentService);

  incidents = this.incidentService.getIncidents();

  statusFilter = this.route.snapshot.queryParamMap.get('status');

  filteredIncidents = computed(() => {
    if (!this.statusFilter) {
      return this.incidents();
    }

    return this.incidents().filter(
      (incident) =>
        incident.status === this.statusFilter
    );
  });
}