import { Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

declare const google:any;

export interface placeInfoI{
  formatted_address:string;
  cords:{lat:number,lng:number}
}

@Component({
  selector: 'app-autocomplete-google',
  templateUrl: './autocomplete-google.component.html',
  styles: [
  ]
})
export class AutocompleteGoogleComponent implements OnInit,AfterViewInit {

  @ViewChild('autocomplete') autocompleteRef!:ElementRef;

  @Input() classes:any;
  @Input() placeholder:string = '';

  autocomplete: any;

  valueInput:string = '';

  @Output() placeInfo:EventEmitter<placeInfoI> = new EventEmitter<placeInfoI>();
  @Output() customAddress:EventEmitter<string> = new EventEmitter<string>();
  @Output() customAddressName:EventEmitter<string> = new EventEmitter<string>();

  @Input() value:string = '';

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
      this.initAutocomplete();
  }

  initAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(

      this.autocompleteRef.nativeElement,
      {
        fields: ['geometry', 'formatted_address','name', 'address_components']
      }
    );

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      const location = place.geometry?.location;
 
      const addresFormatPlus = place.formatted_address.split(', ')

      const namePlace = place.name

      let secondPart:string = addresFormatPlus.slice(1).join(', ');

      let address:string = ''
      if(secondPart == ''){
        address = place.formatted_address
      }else {
        address = `${namePlace}, ${secondPart}`
      }

      this.placeInfo.emit({
        formatted_address: address,
        cords:{
          lat:location.lat(),
          lng:location.lng()
        }
      })

      this.value = address
      this.customAddress.emit(address)
      this.customAddressName.emit(namePlace)
    });
  }
}
