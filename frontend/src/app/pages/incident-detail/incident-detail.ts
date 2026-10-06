import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IncidentService } from '../../services/incident';

@Component({
  selector: 'app-incident-detail',
  imports: [RouterLink],
  templateUrl: './incident-detail.html',
  styleUrl: './incident-detail.css'
})
export class IncidentDetail {
  private route = inject(ActivatedRoute);
  private incidentService = inject(IncidentService);

  incidentId =
    this.route.snapshot.paramMap.get('id');

  incident = computed(() => {
    if (!this.incidentId) {
      return undefined;
    }

    return this.incidentService
      .getIncidentById(this.incidentId);
  });
}