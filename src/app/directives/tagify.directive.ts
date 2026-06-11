import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const $:any;

@Directive({
  selector: '[tagify]'
})
export class TagifyDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    var tagify = $.HSCore.components.HSTagify.init($(this.elementRef.nativeElement));
  }

}
