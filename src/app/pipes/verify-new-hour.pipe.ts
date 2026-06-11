import { Pipe, PipeTransform } from '@angular/core';
interface BloqueAgrupado {
  start: string;
  end: string;
  days: DayI[];
}

interface DayI {
  name: string;
  new:boolean
}

@Pipe({
  name: 'verifyHour',
})
export class VerifyHourDayPipe implements PipeTransform {
  transform(days: DayI[], dayName: string): boolean {
    return days?.some(d => d.name === dayName);
  }
}
