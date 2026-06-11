import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { UserI } from 'src/app/interfaces/user.interface';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { addMonths, subMonths } from 'date-fns';
import { finalize } from 'rxjs';
import { UsersService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import { DatePipe } from '@angular/common';

export interface TypeAppointmentI{
  name:string, 
  ingresos:number[],
  totalPatients:number[],
  ingreso:number,
  color:string
}

declare const $: any; // declare jQuery

@Component({
  selector: 'app-total-sale-for-type-appointment',
  templateUrl: './total-sale-for-type-appointment.component.html',
  styleUrls: ['./total-sale-for-type-appointment.component.scss'],
  providers: [DatePipe],
})
export class TotalSaleForTypeAppointmentComponent  implements OnInit,AfterViewInit,OnChanges {
  @ViewChild('datePicker') datePickerRef!: ElementRef;
  
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

  clientsCount:number = 0

  typesAppinment:TypeAppointmentI[] = []

  startDate:any = null;
  endDate:any = null;
  btnCancelSearchByDates:boolean = false;


  constructor(
    private analyticsService: AnalyticsService,
    private changeDetectorRef: ChangeDetectorRef,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.filters.rangeDates = this.getCurrentYearDateRange()
    // this.getTotalSaleForTypeAppointment();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['rangeDates'] ) {
      if (changes['rangeDates'].currentValue.from) {
        this.filters.rangeDates = this.rangeDates;
        this.getTotalSaleForTypeAppointment();
      }else {
        this.searchWithoutDates()
      }
      
    }
  }

  ngAfterViewInit(){
    const datePicker = $(this.datePickerRef.nativeElement);

    datePicker.on('apply.daterangepicker', (ev:any, picker:any) => {
      this.startDate = picker.startDate.format('YYYY-MM-DD');
      this.endDate = picker.endDate.format('YYYY-MM-DD');
      this.changeFilters();
      this.btnCancelSearchByDates = true;
    });
  }

  prevBtn() {
    this.reset()
    this.currentYearDate = this.currentYearDate - 1
    this.filters.rangeDates = this.getCurrentYearDateRange()
    this.changeDetectorRef.detectChanges()

    this.getTotalSaleForTypeAppointment();
  }

  nextBtn() {
    this.reset()
    this.currentYearDate = this.currentYearDate + 1
    this.filters.rangeDates = this.getCurrentYearDateRange()
    this.changeDetectorRef.detectChanges()

    this.getTotalSaleForTypeAppointment();   
  }

  todayBtn() {
    this.reset()
    this.currentYearDate = new Date().getFullYear();
    this.filters.rangeDates = this.getCurrentYearDateRange()
    this.changeDetectorRef.detectChanges()

    this.getTotalSaleForTypeAppointment();
  }

getCurrentYearDateRange(): { from: Date; to: Date } {

  const currentYear = this.currentYearDate || new Date().getFullYear();

  const firstDay = new Date(currentYear, 0, 1);   // 1 de enero
  const lastDay = new Date(currentYear, 11, 31);  // 31 de diciembre

  return {
    from: firstDay,
    to: lastDay
  };
}


  reset() {
    this.labelsBar = []
    this.dataLine = []
    this.changeDetectorRef.detectChanges()
  }

  setMedico(medico:any){
    this.filters.medico = medico;
    this.getTotalSaleForTypeAppointment();
  }

  changeFilters(){

    this.filters = {
      ...this.filters, 
      rangeDates: {
        from: this.startDate,
        to: this.endDate
      }
    }

    this.getTotalSaleForTypeAppointment();
  }

  searchWithoutDates(){
    this.startDate = null;
    this.endDate = null;
    this.changeFilters();
    this.btnCancelSearchByDates=false
  }

  getTotalSaleForTypeAppointment(force: boolean = false) {
    this.loadGraficUsers = true
    this.analyticsService.getTotalSaleForTypeAppointment(this.currentYearDate.toString(), this.filters).pipe(
      finalize(() => {
        this.loadGraficUsers = false;
      })
    ).subscribe({
      next: ((res: any) => {
        this.typesAppinment = []
        this.labelsBar = []
        this.dataLine = []

        this.typesAppinment = res.typesAppinment
        
        let data = res.data;

       if(data.length > 0){
        data.map((v: any) => {
            let totalMonth = 0       

            if(v.salesByType.length > 0){

              this.typesAppinment.map((type:any) => {
                const index = v.salesByType.findIndex((i:any) => i.typeAppoinment === type.name)
                if(index  === -1){
                  type.ingresos.push(0)
                  type.totalPatients.push(0)
                }else {
                  const ingreso = v.salesByType[index].totalSales
                  const totalPatients = v.salesByType[index].totalPatients

                  type.ingresos.push(Number(ingreso.toFixed(2)));
                  type.totalPatients.push(totalPatients);
                  type.ingreso += ingreso
                  totalMonth += ingreso

                  type.ingreso = Number(type.ingreso.toFixed(2));
                  totalMonth = Number(totalMonth.toFixed(2));
                }
              })
             
            }else {

              this.typesAppinment?.map((type:any) => {
                type.ingresos.push(0)
                type.totalPatients.push(0)

              })
            }

            this.labelsBar.push(`${v.mes} | L ${totalMonth}`)

          })
        }

        this.typesAppinment?.map(type => {
          const color = this.getRandomColor()

          type.color = color

          this.dataLine.push({
            backgroundColor: color,
            label: type.name, 
            data:type.ingresos,
            otherData:type.totalPatients,
            borderColor: color,
            hoverBorderColor: "#2e9e3e",
            pointBackgroundColor: color,
            pointBorderColor: "#fff",
            barThickness: 10,
            maxBarThickness: 10,  
          })
        })

        
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
        virtual:this.dataLine.filter(d => d.label === 'Virtual')[0].data[index]+' $',
        presencial:this.dataLine.filter(d => d.label === 'Presencial')[0].data[index]+' $',
      })
    })


    const columnWidths = [{ wch: 30 }, { wch: 30 }, { wch: 30 } ];
    const forHeader = ['Mes','Citas virtuales', 'Citas presenciales']
    
    const title = `Datos del ${this.formateDate(this.filters.rangeDates.from)} al ${ this.formateDate(this.filters.rangeDates.to)}`

    this.utilsService.exportAsExcel(dataExport, 'Ingresos por tipo de cita',forHeader,columnWidths,title );
  }

    formateDate(date:any){
    let formattedDate:any = this.datePipe.transform(date, 'EEEE d MMMM y');
    return formattedDate
  }
}
