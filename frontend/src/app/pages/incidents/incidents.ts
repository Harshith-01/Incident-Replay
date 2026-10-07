import {
  Component,
  DestroyRef,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class Incidents implements OnInit {
  private route =
    inject(ActivatedRoute);

  private destroyRef =
    inject(DestroyRef);

  incidentService =
    inject(IncidentService);

  incidents =
    this.incidentService.getIncidents();

  statusFilter = signal<string | null>(
    this.route.snapshot.queryParamMap.get('status')
  );


  filteredIncidents =
    computed(() => {

      if (!this.statusFilter()) {
        return this.incidents();
      }

      return this.incidents().filter(
        (incident) =>
          incident.status ===
          this.statusFilter()
      );
    });

  ngOnInit(): void {
        this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.statusFilter.set(params.get('status'));
      });
      
    this.incidentService
      .loadIncidents()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}