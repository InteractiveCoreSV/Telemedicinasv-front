import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseDay'
})
export class ParseDay implements PipeTransform {

  transform(day?:string,complete?:boolean): string {
    if(day == 'Saturday'){
      return complete?'los días Sábado':'Sábado'
    }

    if(day == 'Sunday'){
      return complete?'los días Domingo':'Domingo'
    }

    return complete?'de Lunes a Viernes':'Lunes a Viernes'
  }

}
