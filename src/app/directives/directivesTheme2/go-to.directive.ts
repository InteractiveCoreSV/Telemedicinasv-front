import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const HSGoTo:any;

@Directive({
  selector: '[appGoTo]'
})
export class GoToDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    new HSGoTo(this.elementRef.nativeElement);
  }

}
