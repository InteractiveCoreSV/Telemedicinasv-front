import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-type-paymment',
  templateUrl: './select-type-paymment.component.html',
  styleUrls: ['./select-type-paymment.component.scss']
})
export class SelectTypePaymmentComponent implements OnInit {

  @Input() appendTo:string = '';

  allTypes:any[] = [
    {
      name:'creditCard',
      nameEs:'Trajeta de crédito'
    },
    {
      name:'cash',
      nameEs:'Pago en sucursal'
    },
    {
      name:'insurance',
      nameEs:'Aseguradora'
    },
    {
      name:'transferencia',
      nameEs:'Pago por transferencia'
    },
  ];


  typePaymentSelected:any = null;
  @Output() private typePaymentSelectedEv:EventEmitter<string | undefined> = new EventEmitter<string | undefined>();

  constructor() { }

  ngOnInit(): void {
  }

  selectedtypePayment(){
    this.typePaymentSelectedEv.emit(this.typePaymentSelected);
  }

  clear(){
    this.typePaymentSelected = null;
  }

}
