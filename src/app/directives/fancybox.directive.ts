import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const $:any;

@Directive({
  selector: '[fancybox]'
})
export class FancyboxDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    var fancybox = $.HSCore.components.HSFancyBox.init($(this.elementRef.nativeElement));
  }

}
