import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'incidentStatus'
})
export class IncidentStatusPipe implements PipeTransform {

  transform(status: string): string {

    switch (status) {
      case 'Investigating':
        return 'Under Investigation';

      case 'Resolved':
        return 'Resolved';

      default:
        return status;
    }
  }
}