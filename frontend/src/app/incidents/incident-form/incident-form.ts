import {
  Component,
  inject
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { IncidentService } from '../../services/incident';

@Component({
  selector: 'app-incident-form',
  imports: [ReactiveFormsModule],
  templateUrl: './incident-form.html',
  styleUrl: './incident-form.css'
})
export class IncidentForm {
  incidentService =
    inject(IncidentService);

  private router =
    inject(Router);

  incidentForm =
    new FormGroup({
      title: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(5)
        ]
      }),

      description: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      }),

      service: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      }),

      status: new FormControl(
        'Investigating',
        {
          nonNullable: true
        }
      )
    });

  submit(): void {
    if (this.incidentForm.invalid) {
      this.incidentForm.markAllAsTouched();
      return;
    }

    const value =
      this.incidentForm.getRawValue();

    this.incidentService
      .addIncident({
        title: value.title,
        description: value.description,
        service: value.service,
        status: value.status
      })
      .subscribe({
        next: () => {
          this.incidentForm.reset({
            title: '',
            description: '',
            service: '',
            status: 'Investigating'
          });

          this.router.navigate([
            '/incidents'
          ]);
        }
      });
  }
}