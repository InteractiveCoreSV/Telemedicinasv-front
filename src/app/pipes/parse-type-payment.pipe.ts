import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseTypePayment'
})
export class ParseTypePaymentPipe implements PipeTransform {

  transform(typePayment:any,status:string): string {
    if(typePayment == 'cash'){
      return ['Confirmed','InProgress','Completed'].includes(status) ? 'Pago en sucursal' : 'Pago pendiente en sucursal'
    }

    if(typePayment == 'insurance'){
      return 'Pago con aseguradora'
    }

    if(typePayment == 'transferencia'){
      return 'Pago por transferencia'
    }

    if(typePayment == 'pending_payment'){
      return 'Pendiente de pagar'
    }

    return 'Pago con tarjeta'
  }

}
