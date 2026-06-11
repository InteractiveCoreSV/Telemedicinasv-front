import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const HSCore:any;

@Directive({
  selector: '[appTypedjs]'
})
export class TypedjsDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    HSCore.components.HSTyped.init(this.elementRef.nativeElement);
  }

}
