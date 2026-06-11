import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const HSShowAnimation:any;

@Directive({
  selector: '[appShowAnimation]'
})
export class ShowAnimationDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef) { }


  ngAfterViewInit(){
    new HSShowAnimation(this.elementRef.nativeElement);
  }

}
