import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IncidentService } from '../../services/incident';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private incidentService = inject(IncidentService);

  incidents = this.incidentService.getIncidents();

  get totalIncidents(): number {
    return this.incidents().length;
  }

  get activeIncidents(): number {
    return this.incidents().filter(
      (incident) => incident.status === 'Investigating'
    ).length;
  }

  get resolvedIncidents(): number {
    return this.incidents().filter(
      (incident) => incident.status === 'Resolved'
    ).length;
  }
}