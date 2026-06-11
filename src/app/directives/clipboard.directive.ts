import { Directive, ElementRef, AfterViewInit } from '@angular/core';

declare const $:any;

@Directive({
  selector: '[clipboard]'
})
export class ClipboardDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    var clipboard = $.HSCore.components.HSClipboard.init(this.elementRef.nativeElement);
  }
}
