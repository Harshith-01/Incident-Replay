import { Component ,inject} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IncidentService } from '../../services/incident';
import { Incident } from '../../models/incident';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-incident-form',
  styleUrl: './incident-form.css',
  templateUrl: './incident-form.html',
})
export class IncidentForm {
  private incidentService=inject(IncidentService);

  incidentForm=new FormGroup({
    title:new FormControl('',{
      nonNullable:true,
      validators:[
        Validators.required,
        Validators.minLength(5)
      ]
    }),
    description:new FormControl('',{
      nonNullable:true,
      validators:[
        Validators.required
      ]
    }),
    service:new FormControl('',{
      nonNullable:true,
      validators:[
        Validators.required
      ]
    }),
    status:new FormControl('Investigating',{
      nonNullable:true
    })
  });
submit(): void {

  if (this.incidentForm.invalid) {
    this.incidentForm.markAllAsTouched();
    return;
  }

  const value = this.incidentForm.getRawValue();

  const incident: Incident = {
    id: crypto.randomUUID(),
    title: value.title,
    description: value.description,
    service: value.service,
    status: value.status,
    createdAt: new Date().toISOString()
  };

  this.incidentService.addIncident(incident);

  this.incidentForm.reset({
    title: '',
    description: '',
    service: '',
    status: 'Investigating'
  });
}
}
