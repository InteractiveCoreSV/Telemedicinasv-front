import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { finalize, from } from 'rxjs';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { UtilsService } from 'src/app/services/utils.service';

declare const $: any; // declare jQuery

@Component({
  selector: 'app-report-patients-in-follow-up',
  templateUrl: './report-patients-in-follow-up.component.html',
  styleUrls: ['./report-patients-in-follow-up.component.scss'],
  providers: [DatePipe],
})
export class ReportPatientsInFollowUpComponent implements OnInit,AfterViewInit, OnChanges {
  @ViewChild('datePicker') datePickerRef!: ElementRef;

  loading:boolean = false

  results:any[] = []

  @Input() filters: any = {};
  @Input() rangeDates: any = {};

  currentMonth =  new Date();
  startDate:any = null;
  endDate:any = null;
  btnCancelSearchByDates:boolean = false;

  totalAppointments:number = 0
  totalSales:number = 0

  typingTimer: any

  sortedData: any[] = [];
  sortDirection: { [key: string]: boolean } = {
    userName: true,
    medicoName: false,
    totalCitasConMedico: false,
    totalSales: false,
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
    }

    // this.startDate = null
    // this.endDate = null
    //     this.changeDetectorRef.detectChanges()

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
    this.startDate = null;
    this.endDate = null;
        this.changeDetectorRef.detectChanges()

    this.filters = {
      ...this.filters,
      rangeDates: {from:null,to:null}
    }
    this.btnCancelSearchByDates=false
    
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
    this.analyticsService.getReportPatientsInFollowUp(this.filters).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: ((res: any) => {

        this.results = [];
        this.totalAppointments = 0;
        this.totalSales = 0;

        this.results = res.data

        this.results.map(result => {
          this.totalAppointments = this.totalAppointments + result.totalCitasConMedico
          this.totalSales = this.totalSales + result.totalSales
        })
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
          userName: r.userName,
          medicoName: r.medicoName,
          totalCitasConMedico: r.totalCitasConMedico,
          totalSales: '$ '+r.totalSales.toFixed(2),
        })
    })

    const columnWidths = [{ wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }];
    const forHeader = ['Paciente','Medico','Número de citas','Monto total']
    
    const title = `Datos del ${this.formateDate(this.filters.rangeDates.from)} al ${ this.formateDate(this.filters.rangeDates.to)}`

    this.utilsService.exportAsExcel(dataExport, 'R - Pacientes en seguimiento',forHeader,columnWidths,this.filters.rangeDates.from ? title : undefined );
  }

  formateDate(date:any){
    let formattedDate:any = this.datePipe.transform(date, 'EEEE d MMMM y');
    return formattedDate
  }
}
