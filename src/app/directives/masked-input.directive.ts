import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const $:any;

@Directive({
  selector: '[maskedInput]'
})
export class MaskedInputDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    var mask = $.HSCore.components.HSMask.init($(this.elementRef.nativeElement));
  }
}
