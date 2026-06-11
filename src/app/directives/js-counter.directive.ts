import { Directive, ElementRef, AfterViewInit } from '@angular/core';

declare const HSCounter:any;
declare const $:any;

@Directive({
  selector: '[jsCounter]'
})
export class JsCounterDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    var counter = new HSCounter($(this.elementRef.nativeElement)).init();
  }

}
