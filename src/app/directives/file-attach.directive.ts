import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const $:any;
declare const HSFileAttach:any;

@Directive({
  selector: '[fileAttach]'
})
export class FileAttachDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    var customFile = new HSFileAttach($(this.elementRef.nativeElement)).init();
  }

}
