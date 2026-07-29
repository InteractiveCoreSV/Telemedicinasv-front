import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Pipe({
  name: 'formatAppointmentDate'
})
export class FormatAppointmentDatePipe implements PipeTransform {

  constructor(private utilsService: UtilsService) { }

  transform(appointment: any): string {
    if(!appointment) return '';

    return this.utilsService.formatAppointmentDate(
      appointment.dateAppointment,
      appointment.dateAppointmentEnd,
      appointment.hour?.hours
    );
  }

}
