import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const $:any;

@Directive({
  selector: '[pwstrength]'
})
export class PwstrengthDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    var pwstrength = $.HSCore.components.HSPWStrength.init($(this.elementRef.nativeElement));
  }
}
