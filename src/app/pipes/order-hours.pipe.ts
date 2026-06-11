import { Pipe, PipeTransform } from '@angular/core';
import { Hours2I } from '../interfaces/hours.interface';
@Pipe({
  name: 'orderHours'
})
export class OrderHoursPipe implements PipeTransform {
  transform(hours:Hours2I[],time:string | undefined,day:string| undefined): Hours2I[] {    
    const hoursFilter = hours.filter((h) => h.time === time && h.day === day);

    hoursFilter.sort((a, b) => {
      // Define a función para obtener el minuto, con 0 como valor por defecto si es undefined
     const getMinute = (hour: any) => hour.minute !== undefined ? hour.minute : 0;

      // Ordenar primero por el valor de order
      if (a.order !== b.order) {
        return a.order - b.order;
      }

      // Ordenar por el minuto de hourEnd y hourStart, si se necesita
      const aMinuteStart = getMinute(a.hourStart);
      const bMinuteStart = getMinute(b.hourStart);
      const aMinuteEnd = getMinute(a.hourEnd);
      const bMinuteEnd = getMinute(b.hourEnd);

      // Primero, ordenar por el minuto de hourEnd
      if (aMinuteEnd !== bMinuteEnd) {
        return aMinuteEnd - bMinuteEnd;
      }

      // Si los minutos de hourEnd son iguales, ordenar por el minuto de hourStart
      return aMinuteStart - bMinuteStart;
    });

    return hoursFilter;

  }
}