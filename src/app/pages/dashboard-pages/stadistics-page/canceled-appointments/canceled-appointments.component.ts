import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as dayjs from 'dayjs';
import { UserI } from 'src/app/interfaces/user.interface';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { addMonths, subMonths } from 'date-fns';
import { finalize } from 'rxjs';
import { UsersService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-canceled-appointments',
  templateUrl: './canceled-appointments.component.html',
  styleUrls: ['./canceled-appointments.component.scss'],
   providers: [DatePipe],
})
export class CanceledAppointmentsComponent  implements OnInit, OnChanges {
  @Input() filters: any = {};
  @Input() rangeDates: any = {};
  @Input() userInfo!:UserI | null;

  currentMonthDate: Date = dayjs().startOf('month').toDate();
  currentYearDate: number = new Date().getFullYear();

  dataLine: any[] = []
  labelsBar: string[] = []

  loadGraficUsers:boolean = false

  nextMonth = addMonths(this.currentMonthDate, 1);
  previousMonth = subMonths(this.currentMonthDate, 1);


  constructor(
    private analyticsService: AnalyticsService,
    private changeDetectorRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    // this.getCanceledAppointment();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['rangeDates'] ) {
      if (changes['rangeDates'].currentValue.from) {
        this.filters.rangeDates = this.rangeDates
      }else {
        this.filters.rangeDates = null
      }

      this.getCanceledAppointment();
    }
  }

  prevBtn() {
    this.reset()
    this.currentYearDate = this.currentYearDate - 1
    this.getCanceledAppointment();
  }

  nextBtn() {
    this.reset()
    this.currentYearDate = this.currentYearDate + 1
    this.getCanceledAppointment();   
  }

  todayBtn() {
    this.reset()
    this.currentYearDate = new Date().getFullYear();
    this.getCanceledAppointment();
  }

  reset() {
    this.labelsBar = []
    this.dataLine = []
    this.changeDetectorRef.detectChanges()
  }

  getCanceledAppointment(force: boolean = false) {
    this.loadGraficUsers = true
    this.analyticsService.getCanceledAppointment(this.currentYearDate.toString(), this.filters).pipe(
      finalize(() => {
        this.loadGraficUsers = false;
      })
    ).subscribe({
      next: ((res: any) => {
        this.dataLine = [];
        this.labelsBar = [];
        let data = res.data;

        const citasCanceladas:any[] = []
        const citasCanceladasPatient:any[] = []
        const citasCanceladasTelemed:any[] = []


        if(data.length > 0){
          data.map((v: any) => {
              this.labelsBar.push(`${v.mes}`)
              citasCanceladas.push(v.refused)
              citasCanceladasPatient.push(v.refuseClient)
              citasCanceladasTelemed.push(v.refuseInterno)
          })


        this.dataLine.push({
          data: citasCanceladas,
          label: 'Citas canceladas', 
          backgroundColor: "#ea4850",
          pointBackgroundColor: "#ea4850",
          pointBorderColor: "#ea4850",
          hoverBackgroundColor: "#e7464c",
          borderColor: "#ea4850",
          barThickness: 10,
          maxBarThickness: 10,
        })

        this.dataLine.push({
          data: citasCanceladasPatient,
          label: 'Citas canceladas por pacientes', 
          backgroundColor: "#ffc107",
          pointBackgroundColor: "#ffc107",
          pointBorderColor: "#ffc107",
          hoverBackgroundColor: "#e7464c",
          borderColor: "#ffc107",
          barThickness: 10,
          maxBarThickness: 10,
        })

        this.dataLine.push({
          data: citasCanceladasTelemed,
          label: 'Citas canceladas por Telemedicina', 
          backgroundColor: "#2E4A76",
          pointBackgroundColor: "#2E4A76",
          pointBorderColor: "#2E4A76",
          hoverBackgroundColor: "#e7464c",
          borderColor: "#2E4A76",
          barThickness: 10,
          maxBarThickness: 10,
        })
        

        }
      })
    })
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  exportToExcel(){     
    const dataExport:any = []

   this.labelsBar.forEach((label:any, index:any) => {
      dataExport.push({
        date:label,
        canceladas:this.dataLine.filter(d => d.label === 'Citas canceladas')[0].data[index],
        canceladasP:this.dataLine.filter(d => d.label === "Citas canceladas por pacientes")[0].data[index],
        canceladasT:this.dataLine.filter(d => d.label === "Citas canceladas por Telemedicina")[0].data[index],
      })
    })

    const columnWidths = [{ wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }];
    const forHeader = ['Mes','Citas canceladas','Citas canceladas por pacientes','Citas canceladas por Telemedicina']
    
    const title = `Datos del ${this.rangeDates.from ? `${this.formateDate(this.filters.rangeDates.from)} al ${ this.formateDate(this.filters.rangeDates.to)}`: this.currentYearDate}`

    this.utilsService.exportAsExcel(dataExport, 'Citas canceladas',forHeader,columnWidths,title );
  }

    formateDate(date:any){
    let formattedDate:any = this.datePipe.transform(date, 'EEEE d MMMM y');
    return formattedDate
  }
}
