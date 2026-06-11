import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseAllDay'
})
export class ParseAllDay implements PipeTransform {

  transform(day?: string, complete: boolean = true): string {
    switch (day) {
      case 'Monday':
        return complete ? 'Lunes' : 'Lun';
      case 'Tuesday':
        return complete ? 'Martes' : 'Mar';
      case 'Wednesday':
        return complete ? 'Miércoles' : 'Mié';
      case 'Thursday':
        return complete ? 'Jueves' : 'Jue';
      case 'Friday':
        return complete ? 'Viernes' : 'Vie';
      case 'Saturday':
        return complete ? 'Sábado' : 'Sáb';
      case 'Sunday':
        return complete ? 'Domingo' : 'Dom';
      default:
        return '';
    }
  }

}
