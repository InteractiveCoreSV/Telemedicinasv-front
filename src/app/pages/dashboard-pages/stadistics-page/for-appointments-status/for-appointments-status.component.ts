import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentI } from 'src/app/interfaces/appointment.interface';
import { UserI } from 'src/app/interfaces/user.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { AnalyticsService } from 'src/app/services/analytics.service';
import * as dayjs from 'dayjs';
import 'dayjs/locale/es'; 
import { addMonths, subMonths } from 'date-fns';
import { finalize } from 'rxjs';
import * as moment from 'moment';
import 'moment/locale/es';
import { UtilsService } from 'src/app/services/utils.service';

declare const $: any; // declare jQuery


@Component({
  selector: 'app-for-appointments-status',
  templateUrl: './for-appointments-status.component.html',
  styleUrls: ['./for-appointments-status.component.scss']
})
export class ForAppointmentsStatusComponent implements OnInit, OnChanges {
  @ViewChild('datePicker') datePickerRef!: ElementRef;
  
  @Input() userInfo!:UserI | null;

  currentMonthDate: Date = dayjs().startOf('month').toDate();
  currentYearDate: number = new Date().getFullYear();

  filters: any = {};
  @Input() rangeDates: any = {};


  appointments: AppointmentI[] = [];

  dataBar: any[] = []
  labelsBar: string[] = []

  nextMonth = addMonths(this.currentMonthDate, 1);
  previousMonth = subMonths(this.currentMonthDate, 1);
  
  forYear: string = 'month'
  semanasDelMes:any[] = [];

  citasByStatusLoading: boolean = false;
  citasByStatus: any[] = [];
  citasByStatusRefused: any[] = [];
  windowWidth: number = 0;


  loadGraficAppointmentsForStatus: boolean = false
  loadGraficLineForHour: boolean = false

  isClient:boolean = false

  currentMonth =  new Date();
  startDate:any = null;
  endDate:any = null;
  btnCancelSearchByDates:boolean = false;

  constructor(
    private analyticsService: AnalyticsService,
    private changeDetectorRef: ChangeDetectorRef,
    private utilsService: UtilsService,
  ) {

  }

  ngOnInit(): void {
    // this.getCounterAppointmentsByDayForMonth();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rangeDates'] ) {
      if (changes['rangeDates'].currentValue.from) {
        this.filters.rangeDates = this.rangeDates;
        this.getCounterAppointmentsByDayForMonth();
      }else {
        this.searchWithoutDates()
      }
      
    }
  }

  initDatePicker() {
    setTimeout(() => {
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

    this.getCounterAppointmentsByDayForMonth();
  }

  searchWithoutDates(){
    this.filters = {
      ...this.filters,
      rangeDates: {from:null,to:null}
    }
    this.btnCancelSearchByDates=false
    
    this.changeDetectorRef.detectChanges()
    this.getCounterAppointmentsByDayForMonth()
  }

  todayBtn() {
    this.reset()
    if(this.forYear == 'year'){
      this.currentYearDate = new Date().getFullYear();
      this.getCounterAppointmentsByMouthForYear()
    }
    if (this.forYear === 'month') {
      this.currentMonthDate = dayjs().startOf('month').toDate();
      this.getCounterAppointmentsByDayForMonth()
    }
    if (this.forYear === 'day') {
      this.currentMonthDate = dayjs().startOf('month').toDate();
      this.getCounterAppointmentsByFistGraphicbyday()
    }
  }

  prevBtn() {
    this.reset()
    if (this.forYear == 'year') {
      this.currentYearDate = this.currentYearDate - 1
      this.getCounterAppointmentsByMouthForYear()
    } 
    if (this.forYear === 'month') {
      this.currentMonthDate = addMonths(this.currentMonthDate, - 1);
      this.getCounterAppointmentsByDayForMonth()
    }
    if (this.forYear === 'day') {
      this.currentMonthDate = addMonths(this.currentMonthDate, - 1);
      this.getCounterAppointmentsByFistGraphicbyday()
    }
  }

  nextBtn() {
    this.reset()
    if (this.forYear == 'year') {
      this.currentYearDate = this.currentYearDate + 1
      this.getCounterAppointmentsByMouthForYear()
    } 
    if (this.forYear === 'month') {
      this.currentMonthDate = addMonths(this.currentMonthDate, + 1);
      this.getCounterAppointmentsByDayForMonth()
    }
    if (this.forYear === 'day') {
      this.currentMonthDate = addMonths(this.currentMonthDate, + 1);
      this.getCounterAppointmentsByFistGraphicbyday()
    }
  }

  selectInfoForYear(value: string) {
    this.reset()
    this.forYear = value
    if (value === 'year') {
      this.getCounterAppointmentsByMouthForYear()
    } 
    if (value === 'month'){
      
      this.getCounterAppointmentsByDayForMonth()
    }
    if (value === 'range'){
      this.initDatePicker()
      this.filters = {
        ...this.filters,
        rangeDates: this.getCurrentMonthDateRange(),
      }

      this.startDate = this.filters.rangeDates.from
      this.endDate = this.filters.rangeDates.to
      this.getCounterAppointmentsByDayForMonth()
    }
    if (value === 'day'){
      this.getCounterAppointmentsByFistGraphicbyday()
    }
  }

  getCurrentMonthDateRange(): { from: Date; to: Date } {
    const today = new Date();

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    return {
      from: startOfMonth,
      to: endOfMonth
    };
  }

  getCounterAppointmentsByFistGraphicbyday(force: boolean = false) {
    this.forYear = 'day'
    this.loadGraficAppointmentsForStatus = true
    this.analyticsService.getCounterAppointmentsByFistGraphicbyday(this.currentMonthDate.toString(), this.filters, false).pipe(
      finalize(() => {
        this.loadGraficAppointmentsForStatus = false;
      })
    ).subscribe({
      next: ((res: any) => {
        this.appointments = res.appointments
        let serverAppointments = res.appointments;
        this.appointments = []
        this.labelsBar = []
        this.dataBar = []


        let fecha =  new Date(this.currentMonthDate.toString())
        let primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
        let ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
        let semanaActual:any[] = [];
        this.semanasDelMes = []
        
        for (let dia = primerDia; dia <= ultimoDia; dia.setDate(dia.getDate() + 1)) {
          let diaFormater = moment(dia).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
          let dateFilter = serverAppointments.filter((dateAppointment:any) => dateAppointment._id.dateAppointment === diaFormater)

            if(dateFilter.length > 0){
              semanaActual.push({
                date:diaFormater,
                pending:dateFilter[0].pending,
                reserved:dateFilter[0].reserved,
                confirmed:dateFilter[0].confirmed,
                completed:dateFilter[0].completed,
                refuse:dateFilter[0].refuse,
                
                // refuse24H:dateFilter[0].refuse24H,
                // refuseClient:dateFilter[0].refuseClient,
                // refuseInterno:dateFilter[0].refuseInterno,
                // extraordinaria:dateFilter[0].extraordinaria,
                // reprogramada:dateFilter[0].reprogramada
              });
            }else {
              semanaActual.push({
                date:diaFormater,
                pending:0,
                reserved:0,
                confirmed:0,
                completed:0,
                refuse:0,
                // refuseInterno:0,
                // refuseClient:0,
                // refuse24H:0,
                // extraordinaria:0,
                // reprogramada:0
              });
            }
  
          if (dia.getDay() === 6 || dia.getTime() === ultimoDia.getTime()) {
              this.semanasDelMes.push([...semanaActual]); 
              semanaActual = []; 
          }
        }
        this.setDataGraficaPorSemana(this.semanasDelMes[0])
      })
    })
  }

  setDataGraficaPorSemana(appointments:any){
    this.citasByStatus = []
    this.citasByStatusRefused = []

    this.labelsBar = []
    this.dataBar = []

    appointments.map((v: any) => {
      let sum = v.pending + v.completed + v.confirmed + v.reserved + v.refuse + (v.inProgress || 0) + (v.pendingPayment || 0)
      let formatDate = moment(v.date).format("D MMMM")
      this.labelsBar.push(`${formatDate} | ${sum} citas`)
    })

    let countsPending: any[] = []
    let countsReserved: any[] = []
    let countsConfirmed: any[] = []
    let countsCompleted: any[] = []
    let countsRefuse: any[] = []
    let countsInProgress: any[] = []
    let countsPendingPayment: any[] = []
    // let countsRefuseClient: any[] = []
    // let countsRefuseInterno: any[] = []
    // let countsRefuseI24H: any[] = []
    // let extraordinaria: any[] = []
    // let reprogramadas: any[] = []

    appointments.map((sa: any) => {
      countsPending.push(sa.pending);
      countsReserved.push(sa.reserved);
      countsConfirmed.push(sa.confirmed);
      countsCompleted.push(sa.completed);
      countsRefuse.push(sa.refuse);
      countsInProgress.push(sa.inProgress || 0);
      countsPendingPayment.push(sa.pendingPayment || 0);
      // countsRefuseClient.push(sa.refuseClient);
      // countsRefuseInterno.push(sa.refuseInterno);
      // countsRefuseI24H.push(sa.refuse24H);
      // extraordinaria.push(sa.extraordinaria);
      // reprogramada.push(sa.reprogramada);
    })

    let sumTotal = 0

    // PENDIENTES
    if (countsPending.length > 0) {
      let sumPending = 0
      countsPending.map(r => {
        sumPending = sumPending +r
      })
      
      this.citasByStatus.push({
        _id: 'Pending',
        data: { 
            color:'#e89697', 
            name:'Pendientes'
        },
        count: sumPending
      })

      sumTotal = sumTotal + sumPending

      this.dataBar.push({
        data: countsPending,
        label: 'Citas Pendientes', 
        backgroundColor: "#e89697",
        pointBackgroundColor: "#e89697",
        pointBorderColor: "#e89697",
        hoverBackgroundColor: "#000",
        borderColor: "#e89697",
        barThickness: 10,
        maxBarThickness: 10,
      })
    }

    // RESERVADAS
    if (countsReserved.length > 0) {
      let sumReserver = 0
      countsReserved.map(r => {
        sumReserver = sumReserver + r
      })

      this.citasByStatus.push({
        _id: 'Reserved',
        data: { 
            color:'#95c11f', 
            name:'Reservadas'
        },
        count: sumReserver
      })

      sumTotal = sumTotal + sumReserver

      this.dataBar.push({
        data: countsReserved,
        backgroundColor: "#95c11f",
        pointBackgroundColor: "#95c11f",
        pointBorderColor: "#95c11f",
        label: 'Citas Reservadas', 
        hoverBackgroundColor: "#000",
        borderColor: "#95c11f",
        barThickness: 10,
        maxBarThickness: 10,
      })
    }

    // CONFIRMADA
    if (countsConfirmed.length > 0) {
      let sumConfirmed = 0
      countsConfirmed.map(r => {
        sumConfirmed = sumConfirmed +r
      })
      this.citasByStatus.push({
        _id: 'Confirmed',
        data: { 
            color:'#3a74d3', 
            name:'Confirmadas'
        },
        count: sumConfirmed
      })

      sumTotal = sumTotal + sumConfirmed
      
      this.dataBar.push({
        data: countsConfirmed,
        label: 'Citas Confirmadas', 
        backgroundColor: "#3a74d3",
        pointBackgroundColor: "#3a74d3",
        pointBorderColor: "#3a74d3",
        hoverBackgroundColor: "#000",
        borderColor: "#3a74d3",
        barThickness: 10,
        maxBarThickness: 10,
      })
    }


   // COMPLETADAS
    if (countsCompleted.length > 0) {
      let sumCompleted = 0
      countsCompleted.map(r => {
        sumCompleted = sumCompleted +r
      })
      this.citasByStatus.push({
        _id: 'Completed',
        data: { 
            color:'#2e4a76', 
            name:'Completadas'
        },
        count: sumCompleted
      })

      sumTotal = sumTotal + sumCompleted

      this.dataBar.push({
        data: countsCompleted,
        label: 'Citas Completadas', 
        backgroundColor: "#2e4a76",
        pointBackgroundColor: "#2e4a76",
        pointBorderColor: "#2e4a76",
        hoverBackgroundColor: "#000",
        borderColor: "#2e4a76",
        barThickness: 10,
        maxBarThickness: 10,
      })

    }

    // RECHAZADAS
    if (countsRefuse.length > 0) {
      let sumRefuse = 0
      countsRefuse.map(r => {
        sumRefuse = sumRefuse +r
      })
      // this.citasByStatusRefused.push({
      //   _id: 'Refuse',
      //   data: { 
      //       color:'#ea4850', 
      //       name:'Canceladas'
      //   },
      //   count: sumRefuse
      // })

      this.citasByStatus.push({
        _id: 'Refuse',
        data: { 
            color:'#ea4850', 
            name:'Canceladas'
        },
        count: sumRefuse
      })

      sumTotal = sumTotal + sumRefuse

      this.dataBar.push({
        data: countsRefuse,
        label: 'Citas Canceladas', 
        backgroundColor: "#ea4850",
        pointBackgroundColor: "#ea4850",
        pointBorderColor: "#ea4850",
        hoverBackgroundColor: "#000",
        borderColor: "#ea4850",
        barThickness: 10,
        maxBarThickness: 10,
      })

      
      //para las canceladas por cliente
      // if (countsRefuseClient.length > 0) {
      //   let sumRefuseClient = 0
      //   countsRefuseClient.map(r => {
      //     sumRefuseClient = sumRefuseClient + r
      //   })
      //   this.citasByStatusRefused.push({
      //     _id: 'RefuseCLient',
      //     data: { 
      //         color:'#ea4850', 
      //         name:'Canceladas por cliente'
      //     },
      //     count: sumRefuseClient
      //   })
      // }

      //para las canceladaspor clinica
      // if (countsRefuseInterno.length > 0) {
      //   let sumRefuseInterno = 0
      //   countsRefuseInterno.map(r => {
      //     sumRefuseInterno = sumRefuseInterno + r
      //   })
      //   this.citasByStatusRefused.push({
      //     _id: 'RefuseInterno',
      //     data: { 
      //         color:'#ea4850', 
      //         name:'Canceladaspor clinica'
      //     },
      //     count: sumRefuseInterno
      //   })
      // }

      //para las canceladas 24 horas despues
      // if (countsRefuseI24H.length > 0) {
      //   let sumRefuse24H = 0
      //   countsRefuseI24H.map(r => {
      //     sumRefuse24H = sumRefuse24H + r
      //   })
      //   this.citasByStatusRefused.push({
      //     _id: 'Refuse24H',
      //     data: { 
      //         color:'#ea4850', 
      //         name:'Canceladas 24H antes'
      //     },
      //     count: sumRefuse24H
      //   })
      // }

      //para citas extraordinaria
      // if (extraordinaria.length > 0) {
      //   let extraordinariaSum = 0
      //   extraordinaria.map(r => {
      //     extraordinariaSum = extraordinariaSum + r
      //   })
      //   this.citasByStatus.push({
      //     _id: 'extraordinaria',
      //     data: { 
      //         color:'#00c9a7 ', 
      //         name:'Citas extraordinarias'
      //     },
      //     count: extraordinariaSum
      //   })
      // }

      //para citas reprogramadas
      // if (reprogramada.length > 0) {
      //   let reprogramadasSum = 0
      //   reprogramada.map(r => {
      //     reprogramadasSum = reprogramadasSum + r
      //   })
      //   this.citasByStatus.push({
      //     _id: 'reprogramadas',
      //     data: { 
      //         color:'#f6c300', 
      //         name:'Citas reprogramadas'
      //     },
      //     count: reprogramadasSum
      //   })

      //   this.dataBar.push({
      //     data: reprogramada,
      //     backgroundColor: "#f6c300",
      //     hoverBackgroundColor: "#f6c300",
      //     borderColor: "#f6c300",
      //     barThickness: 10,
      //     maxBarThickness: 10,
      //   })

      //   this.dataBar.push({
      //     backgroundColor: ["#fff"],
      //     data:reprogramada,
      //     borderColor: "#f6c300",
      //     borderWidth: 2,
      //     pointRadius: 0,
      //     hoverBorderColor: "#f6c300",
      //     pointBackgroundColor: "#f6c300",
      //     pointBorderColor: "#fff",
      //     pointHoverRadius: 0
      //   })
      // }

      sumTotal += countsInProgress.reduce((a, b) => a + b, 0) + countsPendingPayment.reduce((a, b) => a + b, 0);

      this.citasByStatus.unshift({
        _id: 'Total',
        data: {
            color:'#272e37',
            name:'Total'
        },
        count: sumTotal
      })

    }

  }

  getCounterAppointmentsByDayForMonth(force: boolean = false) {
    // this.forYear = 'month'
    this.loadGraficAppointmentsForStatus = true
    this.analyticsService.getCounterAppointmentsByFistGraphic(this.currentMonthDate.toString(), this.filters, false).pipe(
      finalize(() => {
        this.loadGraficAppointmentsForStatus = false;
      })
    ).subscribe({
      next: ((res: any) => {
        this.citasByStatus = []
        this.citasByStatusRefused = []
        this.appointments = []
        this.labelsBar = []
        this.dataBar = []

        this.appointments = res.appointments
        let serverAppointments = res.appointments;

        serverAppointments?.sort((a: any, b: any) => {
          const fechaA = new Date(a._id.dateAppointment);
          const fechaB = new Date(b._id.dateAppointment);
          if (fechaA < fechaB) {
            return -1;
          }
          if (fechaA > fechaB) {
            return 1;
          }
          return 0;
        });

        if(serverAppointments.length > 0){
          const seenDates = new Set<string>();
          serverAppointments.map((v: any) => {
            let sum = v.pending + v.completed + v.confirmed + v.reserved + v.refuse + (v.inProgress || 0) + (v.pendingPayment || 0)
            let dateFormat = moment(v._id.dateAppointment).format("D MMMM")
            if (!seenDates.has(dateFormat)) {
              seenDates.add(dateFormat);
              this.labelsBar.push(`${dateFormat} | ${sum} citas`)
            }
          })
  
          let countsPending: any[] = []
          let countsReserved: any[] = []
          let countsConfirmed: any[] = []
          let countsCompleted: any[] = []
          let countsRefuse: any[] = []
          let countsInProgress: any[] = []
          let countsPendingPayment: any[] = []
          // let countsRefuseClient: any[] = []
          // let countsRefuseInterno: any[] = []
          // let countsRefuseI24H: any[] = []
          // let extraordinaria: any[] = []
          // let reprogramadas: any[] = []

          serverAppointments.map((sa: any) => {
            let dateFormat = moment(sa._id.dateAppointment).format("D MMMM");
            this.labelsBar.map( date => {

              const onlyDate = date.split(' |')[0]
              if (dateFormat === onlyDate) {
                countsPending.push(sa.pending);
                countsReserved.push(sa.reserved);
                countsConfirmed.push(sa.confirmed);
                countsCompleted.push(sa.completed);
                countsRefuse.push(sa.refuse);
                countsInProgress.push(sa.inProgress || 0);
                countsPendingPayment.push(sa.pendingPayment || 0);
                // countsRefuseClient.push(sa.refuseClient);
                // countsRefuseInterno.push(sa.refuseInterno);
                // countsRefuseI24H.push(sa.refuse24H);
                // extraordinaria.push(sa.extraordinaria);
                // reprogramadas.push(sa.reprogramada);
              }
            })
  
          })

          let sumTotal = 0

          // PENDIENTES
          if (countsPending.length > 0) {
            let sumPending = 0
            countsPending.map(r => {
              sumPending = sumPending +r
            })
            
            this.citasByStatus.push({
              _id: 'Pending',
              data: { 
                  color:'#e89697', 
                  name:'Pendientes'
              },
              count: sumPending
            })

            sumTotal = sumTotal + sumPending

            this.dataBar.push({
              data: countsPending,
              label: 'Citas Pendientes', 
              backgroundColor: "#e89697",
              pointBackgroundColor: "#e89697",
              pointBorderColor: "#e89697",
              hoverBackgroundColor: "#000",
              borderColor: "#e89697",
              barThickness: 10,
              maxBarThickness: 10,
            })
          }
  
          // RESERVADAS
          if (countsReserved.length > 0) {
            let sumReserver = 0
            countsReserved.map(r => {
              sumReserver = sumReserver +r
            })
            this.citasByStatus.push({
              _id: 'Reserved',
              data: { 
                  color:'#95c11f', 
                  name:'Reservadas'
              },
              count: sumReserver
            })

            sumTotal = sumTotal + sumReserver
            
            this.dataBar.push({
              data: countsReserved,
              backgroundColor: "#95c11f",
              pointBackgroundColor: "#95c11f",
              pointBorderColor: "#95c11f",
              label: 'Citas Reservadas', 
              hoverBackgroundColor: "#000",
              borderColor: "#95c11f",
              barThickness: 10,
              maxBarThickness: 10,
            })
  
          }

          // CONFIRMADA
          if (countsConfirmed.length > 0) {
            let sumConfirmed = 0
            countsConfirmed.map(r => {
              sumConfirmed = sumConfirmed +r
            })
            this.citasByStatus.push({
              _id: 'Confirmed',
              data: { 
                  color:'#3a74d3', 
                  name:'Confirmadas'
              },
              count: sumConfirmed
            })

            sumTotal = sumTotal + sumConfirmed
            
            this.dataBar.push({
              data: countsConfirmed,
              label: 'Citas Confirmadas', 
              backgroundColor: "#3a74d3",
              pointBackgroundColor: "#3a74d3",
              pointBorderColor: "#3a74d3",
              hoverBackgroundColor: "#000",
              borderColor: "#3a74d3",
              barThickness: 10,
              maxBarThickness: 10,
            })
          }
  
          // COMPLETADAS
          if (countsCompleted.length > 0) {
            let sumCompleted = 0
            countsCompleted.map(r => {
              sumCompleted = sumCompleted +r
            })
            this.citasByStatus.push({
              _id: 'Completed',
              data: { 
                  color:'#2e4a76', 
                  name:'Completadas'
              },
              count: sumCompleted
            })

            sumTotal = sumTotal + sumCompleted

            this.dataBar.push({
              data: countsCompleted,
              label: 'Citas Completadas', 
              backgroundColor: "#2e4a76",
              pointBackgroundColor: "#2e4a76",
              pointBorderColor: "#2e4a76",
              hoverBackgroundColor: "#000",
              borderColor: "#2e4a76",
              barThickness: 10,
              maxBarThickness: 10,
            })
  
          }
  
          // CANCELADAS
          if (countsRefuse.length > 0) {
            let sumRefuse = 0
            countsRefuse.map(r => {
              sumRefuse = sumRefuse +r
            })
            // this.citasByStatusRefused.push({
            //   _id: 'Refuse',
            //   data: { 
            //       color:'#ea4850', 
            //       name:'Rechazadas / Canceladas'
            //   },
            //   count: sumRefuse
            // })

            this.citasByStatus.push({
              _id: 'Refuse',
              data: { 
                  color:'#ea4850', 
                  name:'Canceladas'
              },
              count: sumRefuse
            })

            sumTotal = sumTotal + sumRefuse

            this.dataBar.push({
              data: countsRefuse,
              label: 'Citas Canceladas', 
              backgroundColor: "#ea4850",
              pointBackgroundColor: "#ea4850",
              pointBorderColor: "#ea4850",
              hoverBackgroundColor: "#000",
              borderColor: "#ea4850",
              barThickness: 10,
              maxBarThickness: 10,
            })
          }

          //para las canceladas por cliente
          // if (countsRefuseClient.length > 0) {
          //   let sumRefuseClient = 0
          //   countsRefuseClient.map(r => {
          //     sumRefuseClient = sumRefuseClient + r
          //   })
          //   this.citasByStatusRefused.push({
          //     _id: 'RefuseCLient',
          //     data: { 
          //         color:'#ea4850', 
          //         name:'Canceladas por cliente'
          //     },
          //     count: sumRefuseClient
          //   })
          // }
  
          //para las canceladaspor clinica
          // if (countsRefuseInterno.length > 0) {
          //   let sumRefuseInterno = 0
          //   countsRefuseInterno.map(r => {
          //     sumRefuseInterno = sumRefuseInterno + r
          //   })
          //   this.citasByStatusRefused.push({
          //     _id: 'RefuseInterno',
          //     data: { 
          //         color:'#ea4850', 
          //         name:'Canceladaspor clinica'
          //     },
          //     count: sumRefuseInterno
          //   })
          // }

          //para las canceladas 24 horas antes
          // if (countsRefuseI24H.length > 0) {
          //   let sumRefuse24H = 0
          //   countsRefuseI24H.map(r => {
          //     sumRefuse24H = sumRefuse24H + r
          //   })
          //   this.citasByStatusRefused.push({
          //     _id: 'Refuse24H',
          //     data: { 
          //         color:'#ea4850', 
          //         name:'Canceladas 24H antes'
          //     },
          //     count: sumRefuse24H
          //   })
          // }

          //para citas extraordinaria
          // if (extraordinaria.length > 0) {
          //   let extraordinariaSum = 0
          //   extraordinaria.map(r => {
          //     extraordinariaSum = extraordinariaSum + r
          //   })
          //   this.citasByStatus.push({
          //     _id: 'extraordinaria',
          //     data: { 
          //         color:'#00c9a7 ', 
          //         name:'Citas extraordinarias'
          //     },
          //     count: extraordinariaSum
          //   })
          // }

          //para citas reprogramadas
          // if (reprogramadas.length > 0) {
          //   let reprogramadasSum = 0
          //   reprogramadas.map(r => {
          //     reprogramadasSum = reprogramadasSum + r
          //   })
          //   this.citasByStatus.push({
          //     _id: 'reprogramadas',
          //     data: { 
          //         color:'#f6c300', 
          //         name:'Citas reprogramadas'
          //     },
          //     count: reprogramadasSum
          //   })

          //   this.dataBar.push({
          //     data: reprogramadas,
          //     backgroundColor: "#f6c300",
          //     hoverBackgroundColor: "#f6c300",
          //     borderColor: "#f6c300",
          //     barThickness: 10,
          //     maxBarThickness: 10,
          //   })
  
          //   this.dataBar.push({
          //     backgroundColor: ["#fff"],
          //     data:reprogramadas,
          //     borderColor: "#f6c300",
          //     borderWidth: 2,
          //     pointRadius: 0,
          //     hoverBorderColor: "#f6c300",
          //     pointBackgroundColor: "#f6c300",
          //     pointBorderColor: "#fff",
          //     pointHoverRadius: 0
          //   })
          // }

          sumTotal += countsInProgress.reduce((a, b) => a + b, 0) + countsPendingPayment.reduce((a, b) => a + b, 0);

          this.citasByStatus.unshift({
            _id: 'Total',
            data: {
                color:'#272e37',
                name:'Total'
            },
            count: sumTotal
          })

        }



      })
    })
  }

   getCounterAppointmentsByMouthForYear(force: boolean = false) {
    this.loadGraficAppointmentsForStatus = true
    this.analyticsService.getCounterAppointmentsByFistGraphic(this.currentYearDate.toString(), this.filters, true).pipe(
      finalize(() => {
        this.loadGraficAppointmentsForStatus = false;
      })
    ).subscribe({
      next: ((res: any) => {
        this.citasByStatus = []
        this.citasByStatusRefused = []
        this.appointments = []
        this.labelsBar = []
        this.dataBar = []

        this.appointments = res.appointments
        let serverAppointments = res.appointments;

       if(serverAppointments.length > 0){
        serverAppointments.map((v: any) => {
          let sum = v.info.pending + v.info.completed + v.info.confirmed + v.info.reserved + v.info.refuse + (v.info.inProgress || 0) + (v.info.pendingPayment || 0)
          this.labelsBar.push(`${v.mes} | ${sum} citas`)

        })

        let countsPending: any[] = []
        let countsReserved: any[] = []
        let countsConfirmed: any[] = []
        let countsCompleted: any[] = []
        let countsRefuse: any[] = []
        let countsInProgress: any[] = []
        let countsPendingPayment: any[] = []
        // let countsRefuseClient: any[] = []
        // let countsRefuseInterno: any[] = []
        // let countsRefuseI24H: any[] = []
        // let extraordinaria: any[] = []
        // let reprogramadas: any[] = []

        serverAppointments.map((sa: any) => {
          countsPending.push(sa.info.pending);
          countsReserved.push(sa.info.reserved);
          countsConfirmed.push(sa.info.confirmed);
          countsCompleted.push(sa.info.completed);
          countsRefuse.push(sa.info.refuse);
          countsInProgress.push(sa.info.inProgress || 0);
          countsPendingPayment.push(sa.info.pendingPayment || 0);
          // countsRefuseClient.push(sa.refuseClient);
          // countsRefuseInterno.push(sa.refuseInterno);
          // countsRefuseI24H.push(sa.refuse24H);
          // extraordinaria.push(sa.extraordinaria);
          // reprogramadas.push(sa.reprogramada);
        })

          let sumTotal = 0
  
          
        // PENDIENTES
        if (countsPending.length > 0) {
          let sumPending = 0
          countsPending.map(r => {
            sumPending = sumPending +r
          })
          
          this.citasByStatus.push({
            _id: 'Pending',
            data: { 
                color:'#e89697', 
                name:'Pendientes'
            },
            count: sumPending
          })

          sumTotal = sumTotal + sumPending

          this.dataBar.push({
            data: countsPending,
            label: 'Citas Pendientes', 
            backgroundColor: "#e89697",
            pointBackgroundColor: "#e89697",
            pointBorderColor: "#e89697",
            hoverBackgroundColor: "#000",
            borderColor: "#e89697",
            barThickness: 10,
            maxBarThickness: 10,
          })
        }

          //RESERVADAS
        if (countsReserved.length > 0) {
            let sumReserver = 0
            countsReserved.map(r => {
              sumReserver = sumReserver + r
            })
            this.citasByStatus.push({
              _id: 'Reserved',
              data: { 
                  color:'#95c11f', 
                  name:'Reservadas'
              },
              count: sumReserver
            })

            sumTotal = sumTotal + sumReserver

          this.dataBar.push({
            data: countsReserved,
            backgroundColor: "#95c11f",
            pointBackgroundColor: "#95c11f",
            pointBorderColor: "#95c11f",
            label: 'Citas Reservadas', 
            hoverBackgroundColor: "#000",
            borderColor: "#95c11f",
            barThickness: 10,
            maxBarThickness: 10,
          })

        }

        // CONFIRMADA
        if (countsConfirmed.length > 0) {
          let sumConfirmed = 0
          countsConfirmed.map(r => {
            sumConfirmed = sumConfirmed +r
          })
          this.citasByStatus.push({
            _id: 'Confirmed',
            data: { 
                color:'#3a74d3', 
                name:'Confirmadas'
            },
            count: sumConfirmed
          })

          sumTotal = sumTotal + sumConfirmed
          
          this.dataBar.push({
            data: countsConfirmed,
            label: 'Citas Confirmadas', 
            backgroundColor: "#3a74d3",
            pointBackgroundColor: "#3a74d3",
            pointBorderColor: "#3a74d3",
            hoverBackgroundColor: "#000",
            borderColor: "#3a74d3",
            barThickness: 10,
            maxBarThickness: 10,
          })
        }

        // COMPLETADAS
        if (countsCompleted.length > 0) {
          let sumCompleted = 0
          countsCompleted.map(r => {
            sumCompleted = sumCompleted +r
          })
          this.citasByStatus.push({
            _id: 'Completed',
            data: { 
                color:'#2e4a76', 
                name:'Completadas'
            },
            count: sumCompleted
          })

          sumTotal = sumTotal + sumCompleted

          this.dataBar.push({
            data: countsCompleted,
            label: 'Citas Completadas', 
            backgroundColor: "#2e4a76",
            pointBackgroundColor: "#2e4a76",
            pointBorderColor: "#2e4a76",  
            hoverBackgroundColor: "#000",
            borderColor: "#2e4a76",
            barThickness: 10,
            maxBarThickness: 10,
          })
        }

        // CANCELADAS
        if (countsRefuse.length > 0) {
          let sumRefuse = 0
          countsRefuse.map(r => {
            sumRefuse = sumRefuse +r
          })

          this.citasByStatus.push({
            _id: 'Refuse',
            data: { 
                color:'#ea4850', 
                name:'Canceladas'
            },
            count: sumRefuse
          })

          sumTotal = sumTotal + sumRefuse

           this.dataBar.push({
              data: countsRefuse,
              label: 'Citas Canceladas', 
              backgroundColor: "#ea4850",
              pointBackgroundColor: "#ea4850",
              pointBorderColor: "#ea4850",
              hoverBackgroundColor: "#000",
              borderColor: "#ea4850",
              barThickness: 10,
              maxBarThickness: 10,
            })

        }

          //para las canceladas por cliente
          // if (countsRefuseClient.length > 0) {
          //   let sumRefuseClient = 0
          //   countsRefuseClient.map(r => {
          //     sumRefuseClient = sumRefuseClient + r
          //   })
          //   this.citasByStatusRefused.push({
          //     _id: 'RefuseCLient',
          //     data: { 
          //         color:'#ea4850', 
          //         name:'Canceladas por cliente'
          //     },
          //     count: sumRefuseClient
          //   })
          // }
  
          //para las canceladaspor clinica
          // if (countsRefuseInterno.length > 0) {
          //   let sumRefuseInterno = 0
          //   countsRefuseInterno.map(r => {
          //     sumRefuseInterno = sumRefuseInterno + r
          //   })
          //   this.citasByStatusRefused.push({
          //     _id: 'RefuseInterno',
          //     data: { 
          //         color:'#ea4850', 
          //         name:'Canceladaspor clinica'
          //     },
          //     count: sumRefuseInterno
          //   })
          // }

          //para las canceladas 24 horas despues
          // if (countsRefuseI24H.length > 0) {
          //   let sumRefuse24H = 0
          //   countsRefuseI24H.map(r => {
          //     sumRefuse24H = sumRefuse24H + r
          //   })
          //   this.citasByStatusRefused.push({
          //     _id: 'Refuse24H',
          //     data: { 
          //         color:'#ea4850', 
          //         name:'Canceladas 24H antes'
          //     },
          //     count: sumRefuse24H
          //   })
          // }

        //para citas extraordinaria
        // if (extraordinaria.length > 0) {
        //   let extraordinariaSum = 0
        //   extraordinaria.map(r => {
        //     extraordinariaSum = extraordinariaSum + r
        //   })
        //   this.citasByStatus.push({
        //     _id: 'extraordinaria',
        //     data: { 
        //         color:'#00c9a7 ', 
        //         name:'Citas extraordinarias'
        //     },
        //     count: extraordinariaSum
        //   })
        // }

        //para citas reprogramadas
        // if (reprogramadas.length > 0) {
        //   let reprogramadasSum = 0
        //   reprogramadas.map(r => {
        //     reprogramadasSum = reprogramadasSum + r
        //   })
        //   this.citasByStatus.push({
        //     _id: 'reprogramadas',
        //     data: { 
        //         color:'#f6c300', 
        //         name:'Citas reprogramadas'
        //     },
        //     count: reprogramadasSum
        //   })

          
        //   this.dataBar.push({
        //     data: reprogramadas,
        //     backgroundColor: "#f6c300",
        //     hoverBackgroundColor: "#f6c300",
        //     borderColor: "#f6c300",
        //     barThickness: 10,
        //     maxBarThickness: 10,
        //   })

        //   this.dataBar.push({
        //     backgroundColor: ["#fff"],
        //     data:reprogramadas,
        //     borderColor: "#f6c300",
        //     borderWidth: 2,
        //     pointRadius: 0,
        //     hoverBorderColor: "#f6c300",
        //     pointBackgroundColor: "#f6c300",
        //     pointBorderColor: "#fff",
        //     pointHoverRadius: 0
        //   })
        // }

        sumTotal += countsInProgress.reduce((a, b) => a + b, 0) + countsPendingPayment.reduce((a, b) => a + b, 0);

        this.citasByStatus.unshift({
          _id: 'Total',
          data: {
              color:'#272e37',
              name:'Total'
          },
          count: sumTotal
        })

       }

      })
    })
  }

  reset() {
    this.labelsBar = []
    this.dataBar = []
    this.appointments = []
    this.labelsBar = []
    this.dataBar = []
    this.changeDetectorRef.detectChanges()
  }

  exportToExcel(){
    const dataExport:any = []
    this.labelsBar.forEach((label:any, index:any) => {
      dataExport.push({
        date:label,
        total: this.dataBar.reduce((sum, d) => sum + d.data[index], 0),
        pending:this.dataBar.filter(d => d.label === 'Citas Pendientes')[0].data[index],
        reserved:this.dataBar.filter(d => d.label === 'Citas Reservadas')[0].data[index],
        confirmed:this.dataBar.filter(d => d.label === 'Citas Confirmadas')[0].data[index],
        completed:this.dataBar.filter(d => d.label === 'Citas Completadas')[0].data[index],
        refuse:this.dataBar.filter(d => d.label === 'Citas Canceladas')[0].data[index],

      })
    })

    const columnWidths = [{ wch: 30 }, { wch: 15 },{ wch: 15 },{ wch: 15 },{ wch: 15 },{ wch: 15 },{ wch: 15 },];
    const forHeader = ['Fecha','Total','Pendientes','Reservadas','Confirmadas','Completadas','Canceladas']

    this.utilsService.exportAsExcel(dataExport, 'Citas por estado',forHeader,columnWidths);
  }
}
