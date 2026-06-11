import { Directive, ElementRef, AfterViewInit } from '@angular/core';

declare const HSMegaMenu:any;

@Directive({
  selector: '[appMegaMenu]'
})
export class MegaMenuDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    new HSMegaMenu(this.elementRef.nativeElement, {
      desktop: {
        position: 'left'
      }
    });
  }

}
