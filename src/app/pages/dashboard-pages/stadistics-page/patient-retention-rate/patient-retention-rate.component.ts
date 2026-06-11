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
  selector: 'app-patient-retention-rate',
  templateUrl: './patient-retention-rate.component.html',
  styleUrls: ['./patient-retention-rate.component.scss'],
  providers: [DatePipe],
})
export class PatientRetentionRateComponent implements OnInit, OnChanges, AfterViewInit{
  @ViewChild('datePicker') datePickerRef!: ElementRef;
  
  @Input() filters: any = {};
  @Input() rangeDates: any = {};
  @Input() userInfo!:UserI | null;

  currentMonth =  new Date();
  startDate:any = null;
  endDate:any = null;
  btnCancelSearchByDates:boolean = false;

  currentMonthDate: Date = dayjs().startOf('month').toDate();
  currentYearDate: number = new Date().getFullYear();

  dataLine: any[] = []
  labelsBar: string[] = []

  loadGraficUsers:boolean = false

  nextMonth = addMonths(this.currentMonthDate, 1);
  previousMonth = subMonths(this.currentMonthDate, 1);

  data:any[] = []
  constructor(
    private analyticsService: AnalyticsService,
    private changeDetectorRef: ChangeDetectorRef,
    private userService: UsersService,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.filters = {
      ...this.filters,
      rangeDates: this.getCurrentYearDateRange(),
    }

    this.startDate = this.filters.rangeDates.from
    this.endDate = this.filters.rangeDates.to
    // this.getPatientRetentionRate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rangeDates'] ) {
      if (changes['rangeDates'].currentValue.from) {
        this.filters.rangeDates = this.rangeDates
      }else {
        this.filters.rangeDates = null
      }

      this.getPatientRetentionRate();
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

  prevBtn() {
    this.reset()
    this.currentYearDate = this.currentYearDate - 1
    this.getPatientRetentionRate();
  }

  nextBtn() {
    this.reset()
    this.currentYearDate = this.currentYearDate + 1
    this.getPatientRetentionRate();   
  }

  todayBtn() {
    this.reset()
    this.currentYearDate = new Date().getFullYear();
    this.getPatientRetentionRate();
  }

  reset() {
    this.labelsBar = []
    this.dataLine = []
    this.data = []
    this.changeDetectorRef.detectChanges()
  }

  searchWithoutDates(){
    this.filters = {
      ...this.filters,
      rangeDates: this.getCurrentYearDateRange(),
    }
    this.btnCancelSearchByDates=false
    
    this.changeDetectorRef.detectChanges()
    this.getPatientRetentionRate();
  }

  
  changeFilters(){

    this.filters = {
      ...this.filters, 
      rangeDates: {
        from: this.startDate,
        to: this.endDate
      }
    }

    this.getPatientRetentionRate();
  }

  getCurrentYearDateRange(): { from: Date; to: Date } {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0); // 1 de enero a las 00:00:00
    const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999); // 31 de diciembre a las 23:59:59.999

    return {
      from: startOfYear,
      to: endOfYear
    };
  }

  getPatientRetentionRate(force: boolean = false) {
    this.loadGraficUsers = true;
    this.analyticsService.getPatientRetentionRate(this.currentYearDate.toString(), this.filters).pipe(
      finalize(() => {
        this.loadGraficUsers = false;
      })
    ).subscribe({
      next: (res: any) => {
        const data = res.data || [];
        this.data = data;  
        // Limpieza previa
        this.labelsBar = [];
        const retencion: number[] = [];
        const retainedPatients: number[] = [];
        this.dataLine = [];
  
        if (data.length > 0) {
          data.forEach((v: any) => {
            // Agregar el mes como etiqueta
            this.labelsBar.push(v.mes);
  
            // Convertir `retentionRate` a número entero
            const rate = parseFloat(v.retentionRate.replace('%', '')); // Ejemplo: '100.00%' -> 100.00
            retencion.push(rate); // Agregar el porcentaje al array de datos

            retainedPatients.push(v.retainedPatients)
          });
        }
  
        // Configurar los datos del gráfico
        this.dataLine.push({
          backgroundColor: ["#2E4A76"],
          label: 'Porcentaje de Retención',
          data: retencion, // Porcentajes convertidos a 
          otherData:retainedPatients,
          borderColor: "#2E4A76",
          hoverBorderColor: "#2e9e3e",
          pointBackgroundColor: "#2E4A76",
          pointBorderColor: "#fff",
          barThickness: 10,
          maxBarThickness: 10,
        });
      },
      error: (err: any) => {
        console.error('Error fetching patient retention rate:', err);
      }
    });
  }

  exportToExcel(){     
    const dataExport:any = []
  
    this.labelsBar.forEach((label:any, index:any) => {
    dataExport.push({
        date:label,
        tasa:this.dataLine[0].data[index]+'%',
      })
    })

    const columnWidths = [{ wch: 30 }, { wch: 30 }];
    const forHeader = ['Mes','Tasa de retención']
    
    const title = `Datos filtrados del ${this.rangeDates.from ? `${this.formateDate(this.filters.rangeDates.from)} al ${ this.formateDate(this.filters.rangeDates.to)}`: this.currentYearDate}`

    this.utilsService.exportAsExcel(dataExport, 'Pacientes y médicos nuevos',forHeader,columnWidths,title );
  }

    formateDate(date:any){
    let formattedDate:any = this.datePipe.transform(date, 'EEEE d MMMM y');
    return formattedDate
  }
}
