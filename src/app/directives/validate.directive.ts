import { Directive, AfterViewInit } from '@angular/core';

declare const $:any;

@Directive({
  selector: '[validate]'
})
export class ValidateDirective implements AfterViewInit{

  constructor() { }

  ngAfterViewInit(){
    $.HSCore.components.HSValidation.init($(this));
  }

}
