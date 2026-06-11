import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddressI } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-select-address-pickup',
  templateUrl: './select-address-pickup.component.html',
  styleUrls: ['./select-address-pickup.component.scss']
})
export class SelectAddressPickupComponent implements OnInit {

  @Input() appendTo:string = '';

  addresses:AddressI[] = [
    {
      "first_name": "Steven",
      "last_name": "Lopez",
      "company": "VTK",
      "address": "Colonia Santa Fe",
      "aditionalInfo": "Despues del desvio",
      "department": "SAN SALVADOR",
      "municipality": "APOPA",
      "primary": false,
      "cords": {
        "lat": 13.732854098138201,
        "lng": -89.26881529558277
      }
    },
    {
      "first_name": "Steven",
      "last_name": "Lopez",
      "company": "",
      "address": "Avenidad Montevideo #F6 Colonia San Mateo San Salvador CP, San Salvador 1101, El Salvador",
      "aditionalInfo": "La calle enfrente a la esquina",
      "department": "SAN SALVADOR",
      "municipality": "SAN SALVADOR",
      "primary": true,
      "cords": {
        "lat": 13.690024,
        "lng": -89.22145479999999
      }
    }

  ];


  addressSelected:any = null;
  @Output() private addressSelectedEv:EventEmitter<AddressI | undefined> = new EventEmitter<AddressI | undefined>();

  constructor() { }

  ngOnInit(): void {
  }

  selectedService(){
    const serviceObject = this.addresses[this.addressSelected];
    this.addressSelectedEv.emit(serviceObject);
  }

  clear(){
    this.addressSelected = '';
  }

}
