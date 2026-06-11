import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const $:any;

@Directive({
  selector: '[quill]'
})
export class QuillDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    var quill = $.HSCore.components.HSQuill.init(this.elementRef.nativeElement);
  }

}
