import {
  Service,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';

import {
  Observable,
  catchError,
  finalize,
  retry,
  throwError,
  timer,
  tap
} from 'rxjs';

import {
  Incident,
  CreateIncidentRequest,
  UpdateIncidentRequest
} from '../models/incident';

import { environment } from '../../environments/environment';

@Service()
export class IncidentService {
  private http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/incidents`;

  private incidents =
    signal<Incident[]>([]);

  private activeRequests =
    signal(0);

  readonly loading =
    computed(() => this.activeRequests() > 0);

  readonly error =
    signal<string | null>(null);

  private readonly jsonHeaders =
    new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

  getIncidents() {
    return this.incidents.asReadonly();
  }

  loadIncidents(): Observable<Incident[]> {
    this.startRequest();

    this.error.set(null);

    return this.http
      .get<Incident[]>(this.apiUrl, {
        headers: this.jsonHeaders
      })
      .pipe(
        tap((incidents)=>{
          this.incidents.set(incidents);
        }),
        retry({
          count: 2,
          delay: (error, retryCount) => {
            if (
              error.status >= 400 &&
              error.status < 500
            ) {
              return throwError(() => error);
            }

            return timer(retryCount * 500);
          }
        }),

        catchError(
          (error: HttpErrorResponse) => {
            this.error.set(
              this.getErrorMessage(error)
            );

            return throwError(
              () => error
            );
          }
        ),

        finalize(() => {
          this.endRequest();
        })
      );
  }

  getIncidentById(
    id: string
  ): Observable<Incident> {
    this.startRequest();

    this.error.set(null);

    return this.http
      .get<Incident>(
        `${this.apiUrl}/${id}`,
        {
          headers: this.jsonHeaders
        }
      )
      .pipe(
        retry({
          count: 2,
          delay: (error, retryCount) => {
            if (
              error.status >= 400 &&
              error.status < 500
            ) {
              return throwError(() => error);
            }

            return timer(retryCount * 500);
          }
        }),

        catchError(
          (error: HttpErrorResponse) => {
            this.error.set(
              this.getErrorMessage(error)
            );

            return throwError(
              () => error
            );
          }
        ),

        finalize(() => {
          this.endRequest();
        })
      );
  }

  addIncident(
    incident: CreateIncidentRequest
  ): Observable<Incident> {
    this.startRequest();

    this.error.set(null);

    return this.http
      .post<Incident>(
        this.apiUrl,
        incident,
        {
          headers: this.jsonHeaders
        }
      )
      .pipe(
        tap((createdIncident) => {
          this.incidents.update(
            (current) => [
              ...current,
              createdIncident
            ]
          );
        }),
        catchError(
          (error: HttpErrorResponse) => {
            this.error.set(
              this.getErrorMessage(error)
            );
            return throwError(
              () => error
            );
          }
        ),

        finalize(() => {
          this.endRequest();
        })
      );
  }

  updateIncident(
    id: string,
    incident: UpdateIncidentRequest
  ): Observable<Incident> {
    this.startRequest();

    this.error.set(null);

    return this.http
      .put<Incident>(
        `${this.apiUrl}/${id}`,
        incident,
        {
          headers: this.jsonHeaders
        }
      )
      .pipe(
        tap((updatedIncident) => {
          this.incidents.update(
            (current) =>
              current.map((item) =>
                item.id === id
                  ? updatedIncident
                  : item
              )
          );
        }),

        catchError(
          (error: HttpErrorResponse) => {
            this.error.set(
              this.getErrorMessage(error)
            );

            return throwError(
              () => error
            );
          }
        ),

        finalize(() => {
          this.endRequest();
        })
      );
  }

  resolveIncident(
    id: string
  ): Observable<Incident> {
    const incident =
      this.incidents().find(
        (item) => item.id === id
      );

    if (!incident) {
      return throwError(
        () =>
          new Error(
            'Incident not found in application state.'
          )
      );
    }

    return this.updateIncident(
      id,
      {
        title: incident.title,
        description: incident.description,
        service: incident.service,
        status: 'Resolved'
      }
    );
  }

  deleteIncident(
    id: string
  ): Observable<void> {
    this.startRequest();

    this.error.set(null);

    return this.http
      .delete<void>(
        `${this.apiUrl}/${id}`,
        {
          headers: this.jsonHeaders
        }
      )
      .pipe(
        tap(() => {
          this.incidents.update(
            (current) =>
              current.filter(
                (item) => item.id !== id
              )
          );
        }),

        catchError(
          (error: HttpErrorResponse) => {
            this.error.set(
              this.getErrorMessage(error)
            );

            return throwError(
              () => error
            );
          }
        ),

        finalize(() => {
          this.endRequest();
        })
      );
  }

  private startRequest(): void {
    this.activeRequests.update(
      (count) => count + 1
    );
  }

  private endRequest(): void {
    this.activeRequests.update(
      (count) => Math.max(0, count - 1)
    );
  }

  private getErrorMessage(
    error: HttpErrorResponse
  ): string {
    if (error.error?.message) {
      return error.error.message;
    }

    if (error.status === 0) {
      return 'Unable to connect to the server.';
    }

    return `Request failed with status ${error.status}.`;
  }
}