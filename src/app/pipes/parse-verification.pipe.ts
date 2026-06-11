import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseVerified'
})
export class ParseVerifiedPipe implements PipeTransform {

  transform(status?:string,classes?:string): string {
    if(status == 'pending'){
      return `<span class="badge  custom_badge bg-danger ${classes || ''}">Pendiente</span>`;
    }
    
    if(status == 'verified'){
      return `<span class="badge custom_badge bg-success ${classes || ''}">Verificada</span>`;
    }
    
    if(status == 'rejected'){
      return `<span class="badge custom_badge bg-warning ${classes || ''}">Rechazada</span>`;
    }

    return '-';
  }

}
