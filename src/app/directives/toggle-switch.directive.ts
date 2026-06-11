import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const HSToggleSwitch:any;
declare const $:any;

@Directive({
  selector: '[toggleSwitch]'
})
export class ToggleSwitchDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    var toggleSwitch = new HSToggleSwitch($(this.elementRef.nativeElement)).init();
  }
}
