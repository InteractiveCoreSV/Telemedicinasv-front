import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { UtilsService } from 'src/app/services/utils.service';

declare const $: any; // declare jQuery

@Component({
  selector: 'app-report-process-medico',
  templateUrl: './report-process-medico.component.html',
  styleUrls: ['./report-process-medico.component.scss'],
  providers: [DatePipe],
  
})
export class ReportProcessMedicoComponent  implements OnInit,AfterViewInit,OnChanges {
  @ViewChild('datePicker') datePickerRef!: ElementRef;

  loading:boolean = false

  results:any[] = []

  @Input() filters: any = {};
  @Input() rangeDates: any = {};

  currentMonth =  new Date();
  startDate:any = null;
  endDate:any = null;
  btnCancelSearchByDates:boolean = false;

  typingTimer: any

  sortedData: any[] = [];
  sortDirection: { [key: string]: boolean } = {
    totalAppointments: true,
    totalSales: false,
    'servicePrice': false,
    '_id.serviceName': false,
    '_id.medicoName': false,
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

    this.startDate = this.filters.rangeDates.from
    this.endDate = this.filters.rangeDates.to
    
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
    this.analyticsService.getReportProcessMedico(this.filters).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: ((res: any) => {
        this.results = res.data
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

  get totals() {
    return this.results.reduce((acc: any, r: any) => {
      acc.totalAppointments    += (r.totalAppointments    || 0);
      acc.totalSales           += (r.totalSales           || 0);
      acc.totalAppointmentsCompleted += (r.totalAppointmentsCompleted || 0);
      acc.totalSalesCompleted  += (r.totalSalesCompleted  || 0);
      acc.totalAppointmentsRefuse    += (r.totalAppointmentsRefuse    || 0);
      acc.totalSalesRefuse     += (r.totalSalesRefuse     || 0);
      return acc;
    }, { totalAppointments: 0, totalSales: 0, totalAppointmentsCompleted: 0, totalSalesCompleted: 0, totalAppointmentsRefuse: 0, totalSalesRefuse: 0 });
  }

  exportToExcel(){     
    const dataExport:any = []

    this.results.forEach((r:any, ) => {
        dataExport.push({
          medicoName: r._id.medicoName,
          serviceName: r._id.serviceName,
          totalAppointments: r.totalAppointments || 0,
          servicePrice: '$ '+(r.servicePrice || 0),
          totalAppointmentsCompleted: r.totalAppointmentsCompleted || 0,
          totalSales: '$ '+((r.servicePrice || 0) * (r.totalAppointmentsCompleted || 0)),
        })
    })

    const t = this.totals;
    dataExport.push({
      medicoName: 'TOTAL',
      serviceName: '',
      totalAppointments: t.totalAppointments,
      servicePrice: '',
      totalAppointmentsCompleted: t.totalAppointmentsCompleted,
      totalSales: '$ '+this.results.reduce((sum, r) => sum + ((r.servicePrice || 0) * (r.totalAppointmentsCompleted || 0)), 0),
    })

    const columnWidths = [{ wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 30 }];
    const forHeader = ['Medico','Servicio','Cantidad de procedimientos','Precio unitario','Completados','Monto total ingresado']
    
    const title = `Datos del ${this.formateDate(this.filters.rangeDates.from)} al ${ this.formateDate(this.filters.rangeDates.to)}`

    this.utilsService.exportAsExcel(dataExport, 'R - procedimientos por médico',forHeader,columnWidths,title );
  }

  formateDate(date:any){
    let formattedDate:any = this.datePipe.transform(date, 'EEEE d MMMM y');
    return formattedDate
  }
}
