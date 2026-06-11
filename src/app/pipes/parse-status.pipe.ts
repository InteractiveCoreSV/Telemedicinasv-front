import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseStatus'
})
export class ParseStatusPipe implements PipeTransform {

  transform(status?:boolean,classes?:string,activo:boolean=false): string {
    if(status == true){
      return `<span class="badge bg-success custom_badge ${classes || ''}">${activo?'Activo':'Habilitada'}</span>`;
    }else {
      return `<span class="badge bg-danger custom_badge ${classes || ''}">${activo?'Desactivado':'Deshabilitada'}</span>`;
    }

    return '-';
  }

}
