import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'medicoScorePipe'
})
export class MedicoScorePipe implements PipeTransform {

  transform(score: number, decimals: number = 1): number {
    if (score === null || score === undefined) return 0;

    return +(score / 10).toFixed(decimals);
  }
}
