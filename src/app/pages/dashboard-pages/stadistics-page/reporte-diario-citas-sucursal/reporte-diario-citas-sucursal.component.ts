import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { finalize } from 'rxjs';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { UtilsService } from 'src/app/services/utils.service';

declare const $: any; // declare jQuery

@Component({
  selector: 'app-reporte-diario-citas-sucursal',
  templateUrl: './reporte-diario-citas-sucursal.component.html',
  styleUrls: ['./reporte-diario-citas-sucursal.component.scss'],
  providers: [DatePipe],
})
export class ReporteDiarioCitasSucursalComponent implements OnInit,AfterViewInit, OnChanges {
  @ViewChild('datePicker') datePickerRef!: ElementRef;

  loading:boolean = false

  results:any[] = []
  totals:any = null

  @Input() filters: any = {};
  @Input() rangeDates: any = {};

  currentMonth =  new Date();
  startDate:any = null;
  endDate:any = null;
  btnCancelSearchByDates:boolean = false;

  typingTimer: any

  sortedData: any[] = [];
  sortDirection: { [key: string]: boolean } = {
    totalAppointmentsRefuse: false,
    totalSalesRefuse: false,
    totalAppointmentsCompleted: false,
    totalSalesCompleted: false,
    totalAppointments: true,
    '_id.subsidiaryName': false,
  };

  constructor(
    private analyticsService: AnalyticsService,
    private changeDetectorRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    this.filters = {
      ...this.filters,
      rangeDates: this.getCurrentDayDateRange(),
    }

    this.startDate = this.filters.rangeDates.from
    this.endDate = this.filters.rangeDates.to

    // this.getData();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['rangeDates'] ) {
      if (changes['rangeDates'].currentValue.from) {

        this.filters.rangeDates = this.rangeDates;
        this.getData();
      }else {
        this.searchWithoutDates()
      }
      
    }
  }

  ngAfterViewInit() {
    const datePicker = $(this.datePickerRef.nativeElement);

    datePicker.on('apply.daterangepicker', (ev: any, picker: any) => {
      if (picker?.startDate && picker?.endDate) {
        this.startDate = picker.startDate.format('YYYY-MM-DD');
        this.endDate = picker.endDate.format('YYYY-MM-DD');
        this.changeFilters();
        this.btnCancelSearchByDates = true;
        this.changeDetectorRef.detectChanges();
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

    this.getData();
  }

  searchWithoutDates(){
    this.filters = {
      ...this.filters,
      rangeDates: this.getCurrentDayDateRange(),
    }
    this.btnCancelSearchByDates=false
    
    this.changeDetectorRef.detectChanges()
    this.getData()
  }

   getForSearch(){
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }

    // Iniciar un nuevo temporizador
    this.typingTimer = setTimeout(() => {
      this.getData();
    }, 500);
  }

  getCurrentDayDateRange(): { from: Date; to: Date } {
    const today = new Date();

    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    return {
      from: startOfDay,
      to: endOfDay
    };
  }

  getData() {
    this.loading = true
    this.analyticsService.getDailyReportBySubsidiary(this.filters).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: ((res: any) => {
        this.results = res.data
        this.totals = res.totals ?? null
      })
    })
  }

  sortTable(column: string): void {
    const isAscending = this.sortDirection[column];
    this.filters.sortBy = column;
    this.filters.isAscending = isAscending;
    this,this.getData()
    this.sortDirection[column] = !isAscending;
  }

  exportToExcel(){     
    const dataExport:any = []

    this.results.forEach((r:any, ) => {
        dataExport.push({
          subsidiaryName: r._id.subsidiaryName,
          totalAppointments: r.totalAppointments,
          totalAppointmentsRefuse: r.totalAppointmentsRefuse,
          totalAppointmentsCompleted: r.totalAppointmentsCompleted,
          totalAppointmentsPending: r.totalAppointmentsPending,
          totalSalesCompleted: '$ '+r.totalSalesCompleted,
          totalSalesRefuse: '$ '+r.totalSalesRefuse,
        })
    })

    if (this.totals) {
      dataExport.push({
        subsidiaryName: 'TOTAL',
        totalAppointments: this.totals.totalAppointments,
        totalAppointmentsRefuse: this.totals.totalAppointmentsRefuse,
        totalAppointmentsCompleted: this.totals.totalAppointmentsCompleted,
        totalAppointmentsPending: this.totals.totalAppointmentsPending,
        totalSalesCompleted: '$ '+this.totals.totalSalesCompleted,
        totalSalesRefuse: '$ '+this.totals.totalSalesRefuse,
      })
    }

    const columnWidths = [{ wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 25 }];
    const forHeader = ['Sucursal','Total de citas','Citas canceladas','Citas atendidas','Citas Pendientes','Total citas atendidas','Total citas canceladas']
    
    const title = `Datos del ${this.formateDate(this.filters.rangeDates.from)} al ${ this.formateDate(this.filters.rangeDates.to)}`

    this.utilsService.exportAsExcel(dataExport, 'Reporte diario por sucursal',forHeader,columnWidths,title );
  }

    formateDate(date:any){
    let formattedDate:any = this.datePipe.transform(date, 'EEEE d MMMM y');
    return formattedDate
  }
}
