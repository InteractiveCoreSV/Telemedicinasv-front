import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const AOS:any;

@Directive({
  selector: '[appAos]'
})
export class AosDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    AOS.init({
      duration: 650,
      once: true
    });
  }
}
