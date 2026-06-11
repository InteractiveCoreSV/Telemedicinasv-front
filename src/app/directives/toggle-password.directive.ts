import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const HSTogglePassword:any;

@Directive({
  selector: '[togglePassword]'
})
export class TogglePasswordDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    new HSTogglePassword(this.elementRef.nativeElement).init()
  }

}
