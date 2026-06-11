import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const $:any;

@Directive({
  selector: '[customCheckboxCardInput]'
})
export class CustomCheckboxCardInputDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    const element =this.elementRef.nativeElement;
    $(element).change((e:any)=>{
      $(element).closest('.custom-checkbox-card').removeClass('checked');
      $(e.target).closest('.custom-checkbox-card').addClass('checked');
    });
  }
}
