import { Directive, AfterViewInit, ElementRef, HostBinding, Input, OnInit } from '@angular/core';

declare const $:any;

@Directive({
  selector: '[flatpickr]'
})
export class FlatpickrDirective implements OnInit,AfterViewInit{

  @Input()flatpickr:any;

  constructor(private elementRef: ElementRef) { }

  defaultsConfig =  {
    dateFormat:'d/m/Y',
    locale: {
      firstDayOfWeek: 1,
      weekdays: {
        shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
        longhand: [
          'Domingo',
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado',
        ],
      },
      months: {
        shorthand: [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Оct',
          'Nov',
          'Dic',
        ],
        longhand: [
          'Enero',
          'Febreo',
          'Мarzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ],
      },
    },
  }

  @HostBinding("attr.data-hs-flatpickr-options")flatpickrOptions:any;

  ngOnInit(){
    if(this.flatpickr){
      this.flatpickrOptions = JSON.stringify(
        {
        ...this.defaultsConfig,
        ...this.flatpickr
      }
      )
    }else{
      this.flatpickrOptions = JSON.stringify(
        this.defaultsConfig
      )
    }
  }

  ngAfterViewInit(){
    $.HSCore.components.HSFlatpickr.init($(this.elementRef.nativeElement));
  }

}
