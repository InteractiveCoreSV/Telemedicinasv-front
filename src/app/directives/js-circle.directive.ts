import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const $:any;

@Directive({
  selector: '[jsCircle]'
})
export class JsCircleDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    var circle = $.HSCore.components.HSCircles.init($(this.elementRef.nativeElement));
  }

}
