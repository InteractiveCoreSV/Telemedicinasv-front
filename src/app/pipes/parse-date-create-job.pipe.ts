import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseDateCreateOffer'
})
export class ParseDateCreateOfferPipe implements PipeTransform {

  transform(createdAt?: Date,text:string = 'Creado' ): string {
    if (!createdAt) {
      return '';
    }

    const createdAtDate: Date = new Date(createdAt);
    const currentDate: Date = new Date();

    const elapsedMilliseconds = currentDate.getTime() - createdAtDate.getTime();
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);
    const elapsedMonths = Math.floor(elapsedDays / 30); // Aproximado
    const elapsedYears = Math.floor(elapsedMonths / 12); // Aproximado

    if (elapsedYears > 0) {
      return `${text} Hace ${elapsedYears} ${elapsedYears === 1 ? 'Año' : 'Años'}`;
    } else if (elapsedMonths > 0) {
      return `${text} Hace ${elapsedMonths} ${elapsedMonths === 1 ? 'Mes' : 'Meses'}`;
    } else if (elapsedDays > 0) {
      return `${text} Hace ${elapsedDays} ${elapsedDays === 1 ? 'Día' : 'Días'}`;
    } else if (elapsedHours > 0) {
      return `${text} Hace ${elapsedHours} ${elapsedHours === 1 ? 'Hora' : 'Horas'}`;
    } else if (elapsedMinutes > 0) {
      return `${text} Hace ${elapsedMinutes} ${elapsedMinutes === 1 ? 'Minuto' : 'Minutos'}`;
    } else {
      return 'Recién Creado';
    }
  }
}
