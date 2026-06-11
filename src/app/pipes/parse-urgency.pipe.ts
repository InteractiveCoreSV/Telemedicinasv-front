import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseUrgency'
})
export class ParseUrgencyPipe implements PipeTransform {

  transform(urgency:string | undefined,classes?:string): string {

    if(urgency == 'Leve'){
      return `<span class="urgency leve"></span> ${urgency}`;
    }

    if(urgency == 'Grave'){
      return `<span class="urgency grave"></span> ${urgency}`;
    }

    if(urgency == 'Urgente'){
      return `<span class="urgency urgente"></span> ${urgency}`;
    }

    return '-';
  }

}
