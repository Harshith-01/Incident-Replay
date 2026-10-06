import { Injectable, signal } from '@angular/core';
import { Incident } from '../models/incident';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private incidents = signal<Incident[]>([
    {
      id: '1',
      title: 'Task API Failure',
      description: 'POST /api/tasks returning 500',
      service: 'Task API',
      status: 'Investigating',
      createdAt: '2026-10-01T10:00:00Z'
    },
    {
      id: '2',
      title: 'Authentication Failure',
      description: 'Users unable to authenticate',
      service: 'Auth Service',
      status: 'Resolved',
      createdAt: '2026-09-29T10:00:00Z'
    }
  ]);

  getIncidents() {
    return this.incidents.asReadonly();
  }

  getIncidentById(id: string): Incident | undefined {
    return this.incidents().find(
      (incident) => incident.id === id
    );
  }

  addIncident(incident: Incident): void {
    this.incidents.update((current) => [
      ...current,
      incident
    ]);
  }

  resolveIncident(id: string): void {
    this.incidents.update((current) =>
      current.map((incident) =>
        incident.id === id
          ? {
              ...incident,
              status: 'Resolved'
            }
          : incident
      )
    );
  }
}