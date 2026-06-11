import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const HSQuantityCounter:any;
declare const $:any;

@Directive({
  selector: '[quantitycounter]'
})
export class QuantityCounterDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    var quantityCounter = new HSQuantityCounter($(this.elementRef.nativeElement)).init();
  }

}
