import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importa el idioma español
import * as moment from 'moment';
import 'moment/locale/es';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { UserI } from 'src/app/interfaces/user.interface';
import { AlertsService } from 'src/app/services/alerts.service';

declare const $: any; // declare jQuery

@Component({
  selector: 'app-stadistics-page',
  templateUrl: './stadistics-page.component.html',
  styles: [
  ]
})
export class StadisticsPageComponent implements OnInit,AfterViewInit, OnDestroy {
  @ViewChild('datePicker') datePickerRef!: ElementRef;

  filters: any = {};

  currentMonth =  new Date();
  startDate:any = null;
  endDate:any = null;
  btnCancelSearchByDates:boolean = false;

  userInfo!:UserI | null;
  subs:Subscription = new Subscription()

  constructor(
    private authService: AuthService,
    private alertService: AlertsService,
    private change:ChangeDetectorRef
  ) {
    moment.locale('es');
   }

  ngOnInit(): void {
    this.filters = {
      ...this.filters,
    }

    this.startDate = null
    this.endDate = null

    dayjs.locale('es');

    this.subs.add(
      this.authService.getUserInfo().subscribe((userInfo:any)=>{
        this.userInfo = userInfo;
        if(this.userInfo){
          if(this.userInfo.roles && this.userInfo.roles[0]?.name === 'client'){
            this.filters.user = this.userInfo?._id
          }
        }

        this.change.detectChanges()
      })
    )

    this.searchWithoutDates()
  }

  ngAfterViewInit() {
    const datePicker = $(this.datePickerRef.nativeElement);

    datePicker.on('apply.daterangepicker', (ev: any, picker: any) => {
      if (picker?.startDate && picker?.endDate) {
        this.startDate = picker.startDate.format('YYYY-MM-DD');
        this.endDate = picker.endDate.format('YYYY-MM-DD');
        this.changeFilters();
        this.btnCancelSearchByDates = true;
        this.change.detectChanges();
      }
    });


  }

  changeFilters(){

    this.filters = {
      ...this.filters, 
      rangeDates: {
        from: this.startDate,
        to: this.endDate
      }
    }

    // enviar a los componentes
  }

  searchWithoutDates(){
    this.startDate = null;
    this.endDate = null;

    this.filters = {
      ...this.filters,
      rangeDates: {from:null,to:null}
    }
    this.btnCancelSearchByDates=false
    
    this.change.detectChanges()

    // enviar a los componentes
  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
