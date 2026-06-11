import { Directive, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';

declare const HSCore:any;

@Directive({
  selector: '[appLeaflet]'
})
export class LeafletDirective implements AfterViewInit{

  leaflet:any;
  @Output()map:EventEmitter<any> = new EventEmitter<any>();

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
   this.leaflet = HSCore.components.HSLeaflet.init(this.elementRef.nativeElement);
   this.map.emit(this.leaflet);
  }

}
