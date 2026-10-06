import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard')
        .then((m) => m.Dashboard)
  },

  {
    path: 'incidents',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/incidents/incidents')
        .then((m) => m.Incidents)
  },

  {
    path: 'incidents/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./incidents/incident-form/incident-form')
        .then((m) => m.IncidentForm)
  },

  {
    path: 'incidents/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/incident-detail/incident-detail')
        .then((m) => m.IncidentDetail)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then((m) => m.Login)
  },

  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found')
        .then((m) => m.NotFound)
  }
];