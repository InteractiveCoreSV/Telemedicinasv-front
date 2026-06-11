import { Directive, ElementRef, AfterViewInit, Input, HostListener, Renderer2 } from '@angular/core';


@Directive({
  selector: '[appHeader]'
})
export class HeaderDirective implements AfterViewInit{

  @Input() offSet:number = 0;
  heightHeader:number=0;


  constructor(private elementRef: ElementRef,private renderer2: Renderer2) { }

  ngAfterViewInit(){
    this.heightHeader = this.elementRef.nativeElement.offsetHeight;
    this.renderer2.setStyle(this.elementRef.nativeElement,'transition','0.25s');
  }

  @HostListener('window:scroll')
  onScroll(){
    let scrollY = window.scrollY;

    if(scrollY > this.heightHeader + 50){
      this.renderer2.addClass(this.elementRef.nativeElement,'navbar-scrolled');
    }else{
      this.renderer2.removeClass(this.elementRef.nativeElement,'navbar-scrolled');
    }
  }
}
