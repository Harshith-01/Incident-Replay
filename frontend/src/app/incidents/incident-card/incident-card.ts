import { Component,input ,output} from '@angular/core';
import { Incident } from '../../models/incident';
import { DatePipe } from '@angular/common';
import { IncidentStatusPipe } from '../../shared/pipes/incident-status-pipe';
import { RouterLink } from '@angular/router';
@Component({
  imports: [DatePipe,IncidentStatusPipe,RouterLink],
  selector: 'app-incident-card',
  styleUrl: './incident-card.css',
  templateUrl: './incident-card.html',
})
export class IncidentCard {
  incident=input.required<Incident>();
  resolve= output<string>();
  delete=output<string>();
  resolveIncident():void{
    this.resolve.emit(this.incident().id);
  }
  deleteIncident():void{
    this.delete.emit(this.incident().id)
  }
}
