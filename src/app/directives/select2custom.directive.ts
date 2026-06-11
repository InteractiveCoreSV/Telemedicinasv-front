import { Directive, AfterViewInit, ElementRef, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

declare const $:any;

@Directive({
  selector: '[select2custom]'
})
export class Select2customDirective implements AfterViewInit{

  @Output()value = new EventEmitter();
  @Output()unSelectValue = new EventEmitter();

  @Input()formGroup!:FormGroup;
  @Input()formControlName!:string;
  @Input()data!:any[];
  @Input()onlyDropDowm:boolean=false;


  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    if(this.data){
      this.data.forEach((val)=>{
        $(this.elementRef.nativeElement).append(`<option value="${val.id}">${val.text}</option>`)
      });
    }
    var select2 = $.HSCore.components.HSSelect2.init($(this.elementRef.nativeElement));

    if(this.onlyDropDowm){
      $(select2).select2({
        createTag:function (params:any){
          return null
        }
      })
    }

    $(select2).on("select2:select",(e:any)=>{
      let val = $(e.currentTarget).val();
      this.value.emit(val);
      if(this.formGroup != null){
        this.formGroup.get(this.formControlName)?.setValue(val);
      }
    });

    $(select2).on("select2:unselect",(e:any)=>{
      let val = $(e.currentTarget).val();
      this.unSelectValue.emit(val);
      if(this.formGroup){
        this.formGroup.get(this.formControlName)?.setValue(val);
      }
    });

  }

}
