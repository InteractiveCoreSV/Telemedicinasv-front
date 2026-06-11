import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calcYearsOfPracticePipe'
})
export class CalcYearsOfPracticePipe implements PipeTransform {

  transform(startDate: Date | string): string {
    if (!startDate) return '';

    const start = new Date(startDate);
    const now = new Date();

    const diffMs = now.getTime() - start.getTime();
    if (diffMs < 0) return '';

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30.4375); // promedio meses
    const diffYears = Math.floor(diffMonths / 12);

    // ► Si tiene 1 año o más
    if (diffYears >= 1) {
      return diffYears === 1 ? '1 año de experiencia' : `${diffYears} años de experiencia`;
    }

    // ► Si tiene 1 mes o más (pero menos de un año)
    if (diffMonths >= 1) {
      return diffMonths === 1 ? '1 mes de experiencia' : `${diffMonths} meses de experiencia`;
    }

    // ► Si no llega a un mes → días
    return diffDays === 1 ? '1 día de experiencia' : `${diffDays} días de experiencia`;
  }
}