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
  selector: 'app-patients-register',
  templateUrl: './patients-register.component.html',
  styleUrls: ['./patients-register.component.scss'],
  providers: [DatePipe],
})
export class PatientsRegisterComponent implements OnInit,AfterViewInit,OnChanges {
  @ViewChild('datePicker') datePickerRef!: ElementRef;
  
  currentMonth =  new Date();
  startDate:any = null;
  endDate:any = null;
  btnCancelSearchByDates:boolean = false;

  @Input() filters: any = {};
  @Input() rangeDates: any = {};
  @Input() userInfo!:UserI | null;

  currentMonthDate: Date = dayjs().startOf('month').toDate();
  currentYearDate: number = new Date().getFullYear();
  users: UserI[] = [];
  dataLine: any[] = []
  labelsBar: string[] = []

  loadGraficUsers:boolean = false

  nextMonth = addMonths(this.currentMonthDate, 1);
  previousMonth = subMonths(this.currentMonthDate, 1);

  clientsCount:number = 0
  medicosCount:number = 0

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

    // this.getCounterUser();
    // this.getOnlyCounterCLient();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rangeDates'] ) {
      if (changes['rangeDates'].currentValue.from) {
        this.filters.rangeDates = this.rangeDates;
          this.getCounterUser();
      this.getOnlyCounterCLient();
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

  prevBtn() {
    this.reset()
    this.currentYearDate = this.currentYearDate - 1
    this.getCounterUser();
    this.getOnlyCounterCLient();
  }

  nextBtn() {
    this.reset()
    this.currentYearDate = this.currentYearDate + 1
    this.getCounterUser();
    this.getOnlyCounterCLient();
   
  }

  todayBtn() {
    this.reset()
    this.currentYearDate = new Date().getFullYear();
    this.getCounterUser();
    this.getOnlyCounterCLient();
  }

  reset() {
    this.labelsBar = []
    this.dataLine = []
    this.users = []
    this.changeDetectorRef.detectChanges()
  }

  searchWithoutDates(){
    this.filters = {
      ...this.filters,
      rangeDates: this.getCurrentYearDateRange(),
    }
    this.btnCancelSearchByDates=false
    
    this.changeDetectorRef.detectChanges()
    this.getCounterUser();
    this.getOnlyCounterCLient();
  }

  
  changeFilters(){

    this.filters = {
      ...this.filters, 
      rangeDates: {
        from: this.startDate,
        to: this.endDate
      }
    }

    this.getCounterUser();
    this.getOnlyCounterCLient();
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


  getCounterUser(force: boolean = false) {
    this.loadGraficUsers = true
    this.analyticsService.getCounterUser(this.currentYearDate.toString(), this.filters).pipe(
      finalize(() => {
        this.loadGraficUsers = false;
      })
    ).subscribe({
      next: ((res: any) => {
        this.dataLine = []
        this.labelsBar = []
        this.users = []


        this.users = res.users
        let serverUsers = res.users;
  
        let clients: any[] = []
        let medicos: any[] = []

       if(serverUsers.length > 0){
        serverUsers.map((v: any) => {
            this.labelsBar.push(`${v.mes} | ${v.info.clients}P ${v.info.medicos}M`)
            clients.push(v.info.clients);
            medicos.push(v.info.medicos);
          })
        }

        this.dataLine.push({
          backgroundColor: ["#2E4A76"],
          label: 'Pacientes', 
          data:clients,
          borderColor: "#2E4A76",
          hoverBorderColor: "#2e9e3e",
          pointBackgroundColor: "#2E4A76",
          pointBorderColor: "#fff",
          barThickness: 10,
          maxBarThickness: 10,  
        })

        this.dataLine.push({
          backgroundColor: ["#d80000"],
          label: 'Medicos', 
          data:medicos,
          borderColor: "#d80000",
          hoverBorderColor: "#2e9e3e",
          pointBackgroundColor: "#d80000",
          pointBorderColor: "#fff",
          barThickness: 10,
          maxBarThickness: 10,  
        })
      })
    })
  }

  getOnlyCounterCLient(force: boolean = false) {
    this.loadGraficUsers = true
    this.userService.getCounterUser(this.currentYearDate.toString(), this.filters,false).pipe(
      finalize(() => {
        this.loadGraficUsers = false;
      })
    ).subscribe({
      next: ((res: any) => {
        this.clientsCount = 0
        this.medicosCount = 0

        this.clientsCount = res.patient
        this.medicosCount = res.medico
      })
    })
  }

    exportToExcel(){
    const dataExport:any = []

    this.labelsBar.forEach((label:any, index:any) => {
      dataExport.push({
        date:label.split(' | ')[0],
        patient:this.dataLine.filter(d => d.label === 'Pacientes')[0].data[index],
        medico:this.dataLine.filter(d => d.label === 'Medicos')[0].data[index],
      })
    })

    const columnWidths = [{ wch: 30 }, { wch: 30 }, { wch: 30 }];
    const forHeader = ['Mes','Pacientes','Médicos']
    const title = `Datos filtrados del ${this.formateDate(this.filters.rangeDates.from)} al ${ this.formateDate(this.filters.rangeDates.to)}`

    this.utilsService.exportAsExcel(dataExport, 'Pacientes y médicos nuevos',forHeader,columnWidths,title );
  }

  formateDate(date:any){
    let formattedDate:any = this.datePipe.transform(date, 'EEEE d MMMM y');
    return formattedDate
  }
}
