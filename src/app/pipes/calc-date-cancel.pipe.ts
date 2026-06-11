import { Pipe, PipeTransform } from '@angular/core';
import { parseISO } from 'date-fns';

@Pipe({
  name: 'calcDateCancel'
})
export class CalcDateCancelPipe implements PipeTransform {

  transform(dateCancel: string, dateCita: string, hourCancel: string, hourCita: number, textCompleto: boolean = false): string {

    // Convierte la fecha de cancelación y cita a objetos Date
    const parsedDateCancel = parseISO(dateCancel);
    const parsedDateCita = parseISO(dateCita);

    // Extrae la hora de hourCancel (formato string) y convierte a número
    const hourCancelNumber = parseInt(hourCancel.split(' ')[0], 10);

    // Combina fecha y hora para la cancelación y la cita
    const dateCancelTime = new Date(parsedDateCancel);
    dateCancelTime.setHours(hourCancelNumber);

    const dateCitaTime = new Date(parsedDateCita);
    dateCitaTime.setHours(hourCita);

    // Calcula la diferencia en milisegundos
    const diffInMs = dateCitaTime.getTime() - dateCancelTime.getTime();

    // Calcula la diferencia total en horas y días
    const totalDiffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(totalDiffInHours / 24);
    const diffInHours = totalDiffInHours % 24; // Horas restantes después de calcular días

    let result: string;

    if (diffInDays >= 2) {
      result = `${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
    } else if (diffInDays > 0) {
      result = `${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
      if (diffInHours > 0) {
        result += ` y ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
      }
    } else if (diffInHours > 0) {
      result = `${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    } else {
      result = 'menos de 1 hora';
    }

    return `${textCompleto ? 'Cancelada ' : ''}${result} ${diffInMs > 0 ? 'antes' : 'después'}`;
  }
}
