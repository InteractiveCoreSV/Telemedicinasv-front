import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spanStatusSolicitudMedico'
})
export class ParseStatusSolicitudMedicoPipe implements PipeTransform {

  transform(status:string,classes?:string): string {
    if(status == 'Nueva solicitud'){
      return `<span class="badge bg-reserved ${classes || ''}">Nueva solicitud</span>`;
    }

    if(status == 'En progreso'){
      return `<span class="badge bg-inProgress ${classes || ''}">En progreso</span>`;
    }

    if(status == 'Denegada'){
      return `<span class="badge bg-refused ${classes || ''}">Denegada</span>`;
    }

    if(status == 'Aceptada'){
      return `<span class="badge bg-confirmed ${classes || ''}">Aceptada</span>`;
    }

    return '-';
  }

}
