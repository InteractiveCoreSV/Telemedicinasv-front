import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const $: any;

@Directive({
  selector: '[menuNavbar]'
})
export class MenuNavbarDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
   setTimeout(()=>{
    var sidebar = $(this.elementRef.nativeElement).hsSideNav();
   },250);
  }

}
