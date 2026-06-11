import { Pipe, PipeTransform } from '@angular/core';
import { AppointmentI } from '../interfaces/appointment.interface';

@Pipe({
  name: 'orderAppointmentsByHour'
})
export class OrderAppointmentsByHourPipe implements PipeTransform {

  transform(appointments:AppointmentI[]): AppointmentI[] {
    return appointments.sort((a,b)=>{

      if(a.hour &&  b.hour) {
        if (a.hour.time === b.hour.time) {
          return a.hour.order - b.hour.order;
        } else if (a.hour.time === 'morning') {
          return -1;
        } else {
          return 1;
        }
      }else {
        return 1;
      }

      
    })
  }

}
