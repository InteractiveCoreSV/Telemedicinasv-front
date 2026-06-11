import { Pipe, PipeTransform } from '@angular/core';
import { ServiceI } from '../interfaces/service.interface';

@Pipe({
  name: 'checkedService'
})
export class CheckedServicePipe implements PipeTransform {

  transform(servicesSelected: ServiceI[], service:ServiceI): boolean {
    return servicesSelected.some(s => s._id === service._id);
  }

}
