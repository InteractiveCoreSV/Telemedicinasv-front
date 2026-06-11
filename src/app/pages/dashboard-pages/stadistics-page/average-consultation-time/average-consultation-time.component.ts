import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { UserI } from 'src/app/interfaces/user.interface';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { addMonths, subMonths } from 'date-fns';
import { finalize } from 'rxjs';
import { UsersService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import { DatePipe } from '@angular/common';

declare const $: any; // declare jQuery

@Component({
  selector: 'app-average-consultation-time',
  templateUrl: './average-consultation-time.component.html',
  styleUrls: ['./average-consultation-time.component.scss'],
  providers: [DatePipe],
  
})
export class AverageConsultationTimeComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('datePicker') datePickerRef!: ElementRef;
  
  @Input() filters: any = {};
  @Input() rangeDates: any = {};
  @Input() userInfo!:UserI | null;

  // currentMonthDate: Date = dayjs().startOf('month').toDate();
  // currentYearDate: number = new Date().getFullYear();

  dataLine: any[] = []
  labelsBar: string[] = []

  medicoName!:string  | null

  loadGraficUsers:boolean = false

  // nextMonth = addMonths(this.currentMonthDate, 1);
  // previousMonth = subMonths(this.currentMonthDate, 1);

  currentMonth =  new Date();
  startDate:any = null; 
  endDate:any = null;
  btnCancelSearchByDates:boolean = false;

  data:any[] = []
  constructor(
    private analyticsService: AnalyticsService,
    private changeDetectorRef: ChangeDetectorRef,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.filters.rangeDates = this.getCurrentYearDateRange()
    this.startDate = this.filters.rangeDates.from;
    this.endDate = this.filters.rangeDates.to;
    // this.getTimeAppointment();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rangeDates'] ) {
      if (changes['rangeDates'].currentValue.from != null) {
        this.filters.rangeDates = this.rangeDates;
        this.getTimeAppointment();
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

    this.getTimeAppointment();
  }

  searchWithoutDates(){
    this.filters = {
      ...this.filters,
      rangeDates: this.getCurrentYearDateRange(),
    }

    this.startDate = this.filters.rangeDates.from;
    this.endDate = this.filters.rangeDates.to;

    this.btnCancelSearchByDates=false
    
    // this.changeDetectorRef.detectChanges()
    this.getTimeAppointment()
  }

  // prevBtn() {
  //   this.reset()
  //   this.currentYearDate = this.currentYearDate - 1
  //   this.getTimeAppointment();
  // }

  // nextBtn() {
  //   this.reset()
  //   this.currentYearDate = this.currentYearDate + 1
  //   this.getTimeAppointment();   
  // }

  // todayBtn() {
  //   this.reset()
  //   this.currentYearDate = new Date().getFullYear();
  //   this.getTimeAppointment();
  // }

  // reset() {
  //   this.labelsBar = []
  //   this.dataLine = []
  //   this.data = []
  //   this.changeDetectorRef.detectChanges()
  // }

  setDataMedico(medico:UserI){
    this.filters.medico = medico._id; 
    this.medicoName = medico.names+' '+medico.last_names;
    this.getTimeAppointment()
  }

getCurrentYearDateRange(): { from: Date; to: Date } {

  const currentYear =  new Date().getFullYear();

  const firstDay = new Date(currentYear, 0, 1);   // 1 de enero
  const lastDay = new Date(currentYear, 11, 31);  // 31 de diciembre

  return {
    from: firstDay,
    to: lastDay
  };
}

  getTimeAppointment(force: boolean = false) {
    this.loadGraficUsers = true;
    this.analyticsService.getTimeAppointment(this.filters).pipe(
      finalize(() => {
        this.loadGraficUsers = false;
      })
    ).subscribe({
      next: (res: any) => {
        const data = res.data || [];
        this.data = data;
  
        // Limpieza previa
        this.labelsBar = [];
        const time: number[] = [];
        this.dataLine = [];
  
        if (data.length > 0) {
          data.forEach((v: any) => {
            // Agregar el mes como etiqueta
            this.labelsBar.push(v.mes);
  
            time.push(v.averageTime.toFixed(2)); 
          });
        }
  
        // Configurar los datos del gráfico
        this.dataLine.push({
          backgroundColor: ["#2E4A76"],
          label: 'Tiempo promedio de consulta',
          data: time, 
          borderColor: "#2E4A76",
          hoverBorderColor: "#2e9e3e",
          pointBackgroundColor: "#2E4A76",
          pointBorderColor: "#fff",
          barThickness: 10,
          maxBarThickness: 10,
        });
      },
      error: (err: any) => {
        console.error(':', err);
      }
    });
  }
  
  exportToExcel(){
    const dataExport:any = []
    this.labelsBar.forEach((label:any, index:any) => {
      dataExport.push({
        month:label,
        time: this.dataLine[0].data[index]+' minutos',
        doctor: this.medicoName ? this.medicoName : 'En general',
      })
    })

    const columnWidths = [{ wch: 30 }, { wch: 15 }, { wch: 30 }];
    const forHeader = ['Fecha','Tiempo promedio','Médico']
    const title = `Datos del ${this.formateDate(this.filters.rangeDates.from)} al ${ this.formateDate(this.filters.rangeDates.to)}`

    this.utilsService.exportAsExcel(dataExport, 'Tiempo promedio de consulta',forHeader,columnWidths,title);
  }

  formateDate(date:any){
    let formattedDate:any = this.datePipe.transform(date, 'EEEE d MMMM y');
    return formattedDate
  }
}
