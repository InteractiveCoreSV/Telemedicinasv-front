import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as dayjs from 'dayjs';
import { UserI } from 'src/app/interfaces/user.interface';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { addMonths, subMonths } from 'date-fns';
import { finalize } from 'rxjs';
import { UsersService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-daily-appointment-report',
  templateUrl: './daily-appointment-report.component.html',
  styleUrls: ['./daily-appointment-report.component.scss'],
  providers: [DatePipe],
})
export class DailyAppointmentReportComponent  implements OnInit, OnChanges {
  @Input() filters: any = {};
  @Input() rangeDates: any = {};
  @Input() userInfo!:UserI | null;

  currentDate: Date = dayjs().startOf('day').toDate();

  appointments: any

  loading:boolean = false

  nextMonth = addMonths(this.currentDate, 1);
  previousMonth = subMonths(this.currentDate, 1);

  constructor(
    private analyticsService: AnalyticsService,
    private changeDetectorRef: ChangeDetectorRef,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    // this.getDailyReport();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rangeDates'] ) {
      if (changes['rangeDates'].currentValue?.from) {
        this.filters.rangeDates = this.rangeDates
      }else {
        this.filters.rangeDates = null
      }

      this.getDailyReport();
    }
  }

  prevBtn() {
    this.reset()
    this.currentDate = dayjs(this.currentDate).startOf('day').subtract(1, 'day').toDate();
    this.getDailyReport();
  }

  nextBtn() {
    this.reset()
    this.currentDate = dayjs(this.currentDate).startOf('day').add(1, 'day').toDate()
    this.getDailyReport();   
  }

  todayBtn() {
    this.reset()
    this.currentDate = dayjs().startOf('day').toDate();
    this.getDailyReport();
  }

  reset() {
    this.appointments = []
    this.changeDetectorRef.detectChanges()
  }

  getDailyReport(force: boolean = false) {
    this.loading = true
    this.analyticsService.getDailyAppointmentReport(this.currentDate.toString(), this.filters).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: ((res: any) => {
        this.appointments = res.data[0]
      })
    })
  }

  exportToExcel(){
    const dataExport:any = []
    dataExport.push({
      day: this.rangeDates && this.rangeDates.from ?  `${this.formateDate(this.rangeDates.from)} - ${ this.formateDate(this.rangeDates.to)}` : this.formateDate(this.currentDate),
      totalAppointmentsCompleted: this.appointments && this.appointments.totalAppointmentsCompleted ? this.appointments.totalAppointmentsCompleted : 0,
      totalSalesCompleted: this.appointments && this.appointments.totalSalesCompleted ? this.appointments.totalSalesCompleted : 0,
      totalAppointmentsRefuse: this.appointments && this.appointments.totalAppointmentsRefuse ? this.appointments.totalAppointmentsRefuse : 0,
      totalSalesRefuse: this.appointments && this.appointments.totalSalesRefuse ? this.appointments.totalSalesRefuse : 0,
    })

    const columnWidths = [{ wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }];
    const forHeader = ['Fecha','Citas completadas','Monto citas completadas','Citas canceladas','Monto citas canceladas']

    this.utilsService.exportAsExcel(dataExport, 'Reporte diario de citas',forHeader,columnWidths);
  }

  formateDate(date:any){
    let formattedDate:any = this.datePipe.transform(date, 'EEEE, d MMMM, y');
    return formattedDate
  }
}
