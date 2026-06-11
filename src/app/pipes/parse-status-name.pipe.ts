import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseStatusName'
})
export class ParseStatusNamePipe implements PipeTransform {

  transform(status:string,classes?:string): string {
    if(status == 'Reserved'){
      return `<span class="badge bg-reserved ${classes || ''}">Reservada</span>`;
    }

    if(status == 'Completed'){
      return `<span class="badge bg-completed ${classes || ''}">Completada</span>`;
    }

    if(status == 'Refuse'){
      return `<span class="badge bg-refused ${classes || ''}">Cancelada</span>`;
    }

    if(status == 'Confirmed'){
      return `<span class="badge bg-confirmed ${classes || ''}">Confirmada</span>`;
    }

    if(status == 'Pending'){
      return `<span class="badge bg-pending ${classes || ''}">Pendiente</span>`;
    }

    if(status == 'InProgress'){
      return `<span class="badge bg-inProgress ${classes || ''}">En Consulta</span>`;
    }

    if(status == 'pending_payment'){
      return `<span class="badge bg-pending_payment ${classes || ''}">Pendiente de pago</span>`;
    }

    return '-';
  }

}
