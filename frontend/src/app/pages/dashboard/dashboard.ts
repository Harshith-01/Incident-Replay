import {
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { IncidentService } from '../../services/incident';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private destroyRef =
    inject(DestroyRef);

  private incidentService =
    inject(IncidentService);

  incidents =
    this.incidentService.getIncidents();

  ngOnInit(): void {
    this.incidentService
      .loadIncidents()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  get totalIncidents(): number {
    return this.incidents().length;
  }

  get activeIncidents(): number {
    return this.incidents().filter(
      (incident) =>
        incident.status === 'Investigating'
    ).length;
  }

  get resolvedIncidents(): number {
    return this.incidents().filter(
      (incident) =>
        incident.status === 'Resolved'
    ).length;
  }
}