import { Directive, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

declare const $: any;
declare const HSFormSearch: any;

@Directive({
  selector: '[NavbarVerticalNavigation]'
})
export class NavbarVerticalNavigationDirective implements AfterViewInit,OnDestroy {

  setTimeOut:any;
  sub:Subscription = new Subscription();

  // constructor(private ngxRolesService: NgxRolesService) { }
  constructor(){}

  ngAfterViewInit() {
  //  this.sub = this.ngxRolesService.roles$.subscribe((rol)=>{
  //     if(Object.keys(rol).length>0){
  //       this.initDirective();
  //     }
  //   });
  this.initDirective();
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  initDirective(){
   if(!this.setTimeOut){
    this.setTimeOut =  setTimeout(()=>{
      $('.js-navbar-vertical-aside-toggle-invoker').click(function () {
        $('.js-navbar-vertical-aside-toggle-invoker i').tooltip('hide');
      });
      var sidebar = $('.js-navbar-vertical-aside').hsSideNav();
      $('.js-nav-tooltip-link').tooltip({ boundary: 'window' })

      $(".js-nav-tooltip-link").on("show.bs.tooltip", function (e:any) {
        if (!$("body").hasClass("navbar-vertical-aside-mini-mode")) {
          return false;
        }
        return null;
      });

      // INITIALIZATION OF FORM SEARCH
      // =======================================================
      $('.js-form-search').each( () => {
        new HSFormSearch($(this)).init()
      });
      this.setTimeOut = null;
    },1000);
   }
  }
}
