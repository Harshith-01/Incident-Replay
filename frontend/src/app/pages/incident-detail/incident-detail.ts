import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Incident } from '../../models/incident';
import { IncidentService } from '../../services/incident';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-incident-detail',
  imports: [RouterLink,DatePipe],
  templateUrl: './incident-detail.html',
  styleUrl: './incident-detail.css'
})
export class IncidentDetail implements OnInit {
  private route =
    inject(ActivatedRoute);

  private destroyRef =
    inject(DestroyRef);

  incidentService =
    inject(IncidentService);

  incident =
    signal<Incident | undefined>(
      undefined
    );

  ngOnInit(): void {
    const id =
      this.route.snapshot.paramMap.get(
        'id'
      );

    if (!id) {
      return;
    }

    this.incidentService
      .getIncidentById(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (incident) => {
          this.incident.set(incident);
        }
      });
  }
}