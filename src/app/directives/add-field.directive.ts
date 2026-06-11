import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const $:any;
declare const HSAddField:any;
declare const HSQuantityCounter:any;

@Directive({
  selector: '[addField]'
})
export class AddFieldDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    $(this.elementRef.nativeElement).each( () => {
      new HSAddField($(this), {
        addedField: function () {
          $('.js-add-field .js-select2-custom-dynamic').each( () => {
            var select2dynamic = $.HSCore.components.HSSelect2.init($(this));
          });

          $('[data-toggle="tooltip"]').tooltip();

          $('.js-add-field .js-quantity-counter-dynamic').each( () => {
            var quantityCounter = new HSQuantityCounter($(this)).init();
          });
          $('.js-quantity-counter').each( () => {
            var quantityCounter = new HSQuantityCounter($(this)).init();
          });
          $('.js-add-field .js-masked-input').each( () => {
            var mask = $.HSCore.components.HSMask.init($(this));
          });
        },
        deletedField: function() {
          $('.tooltip').hide();
        }
      }).init();
    });
  }
}
