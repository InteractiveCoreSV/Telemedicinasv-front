import { Directive, ElementRef, AfterViewInit } from '@angular/core';

declare const $:any;
declare const HSUnfold:any;

@Directive({
  selector: '[unfold]'
})
export class UnfoldDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
  const el = this.elementRef.nativeElement;

  // Verificar que existe y tiene opciones de unfold
  if (el && el.hasAttribute('data-hs-unfold-options')) {
    new HSUnfold(el).init();
  }
}


}
