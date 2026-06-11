import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';

import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, Calendar, DatesSetArg } from '@fullcalendar/core';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { ViewAppoimentsModalComponent } from '../../components/modals/view-appoiments-modal/view-appoiments-modal.component';
import { UtilsService } from 'src/app/services/utils.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { OrderAppointmentsByHourPipe } from 'src/app/pipes/order-appointments-by-hour.pipe';
import * as dayjs from 'dayjs';
import { AppointmentI } from 'src/app/interfaces/appointment.interface';
import { UserI } from 'src/app/interfaces/user.interface';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Hours2I } from 'src/app/interfaces/hours.interface';
import { ChangeStatusAppointmentModalComponent } from 'src/app/components/modals/appointments/change-status-appointment-modal/change-status-appointment-modal.component';
import { ViewAppoimentsModalComponent } from 'src/app/components/modals/appointments/view-appoiments-modal/view-appoiments-modal.component';
import { NewAppointmentFormsService } from '../appointments-page/new-appointment-page/new-appointment-forms.service';
import { PayAppointmentComponent } from 'src/app/components/modals/appointments/pay-appointment/pay-appointment.component';
import { ActivatedRoute } from '@angular/router';
import { ViewDetailAppointmentModalComponent } from 'src/app/components/modals/appointments/view-detail-appointment-modal/view-detail-appointment-modal.component';

@Component({
  selector: 'app-calendar-appointments-page',
  templateUrl: './calendar-appointments-page.component.html',
  styleUrls: ['./calendar-appointments-page.component.scss'],
  providers:[OrderAppointmentsByHourPipe]
})
export class CalendarAppointmentsPageComponent implements OnInit,AfterViewInit,OnDestroy {
  currentMonth = new Date().getMonth()+1;

  currentTitle:string='';
  moreLinkClick: boolean = false;

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarApi!: Calendar;

  currentMonthDate:Date = dayjs().startOf('month').toDate();

  calendarOptions: CalendarOptions = {
    plugins:[
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin
    ],
    initialView:'dayGridMonth',
    headerToolbar:false,
    locale:'es',
    height:'auto',
    selectable:true,
    moreLinkContent: {
      html: '<btn class="todas-las-citas">Ver todas</btn>'
    },
    eventOrder:this.orderEvents.bind(this),
    events:[
    ],
    eventDisplay:'list-item',
    dayMaxEvents:4,
    datesSet:this.datesSet.bind(this),
    eventClick:this.changeStatusModal.bind(this),
    dateClick:this.openViewAppoinments.bind(this)
  };

  datesRequested:string[] = [];

  filters:any = {};
  hoursObj:Hours2I[] = [];
  
  userInfo!:UserI | null;
  subs:Subscription = new Subscription()

  typingTimer: any

  constructor(
    private ngbModal: NgbModal,
    private changeDetectorRef: ChangeDetectorRef,
    private appointmentsService: AppointmentsService,
    private orderAppointmentsByHourPipe: OrderAppointmentsByHourPipe,
    private utilsService: UtilsService,
    private authService: AuthService,
    private newAppointmentFormsService: NewAppointmentFormsService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const idAppointment = this.route.snapshot.queryParamMap.get('appointment') || '';
    if(idAppointment){
      this.viewDetailAppointment(idAppointment)
    }

    this.subs.add(
      this.authService.getUserInfo().subscribe((userInfo:UserI|null)=>{

       if(userInfo){
        this.userInfo = userInfo;
        this.filters = {user:this.userInfo?._id, roleUser:this.userInfo?.roles?this.userInfo?.roles[0].name:''}
        this.getAllAppointmentsByMonth(true)
       }
      })
    )
    
   
    this.subs.add(
      this.newAppointmentFormsService.appointmentRegistered$.subscribe(newAppointment => {
        if(newAppointment){
          this.getAllAppointmentsByMonth(true)
        }
      })
    )

    this.subs.add(
      this.newAppointmentFormsService.appointmentRegistered$.subscribe(newAppointment => {
        if(newAppointment){
          this.getAllAppointmentsByMonth(true)
        }
      })
    )

    this.subs.add(
      this.appointmentsService.updateAppointmets$.subscribe(update => {
        if(update){
          this.getAllAppointmentsByMonth(true)
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getForSearch(){
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }

    // Iniciar un nuevo temporizador
    this.typingTimer = setTimeout(() => {
      this.getAllAppointmentsByMonth(true);
    }, 700);
  }

  getAllAppointmentsByMonth(force:boolean = false){
    if(force){
      this.datesRequested = [];
      this.calendarOptions.events = [];
    }

    if(this.datesRequested.includes(dayjs(this.currentMonthDate).format('YYYY-MM-DD'))){
      return;
    }

    this.appointmentsService.getAllAppointmentsByMonth(this.currentMonthDate.toString(),this.filters).subscribe({
      next:((res:any)=>{
        
        let currentEvents = this.calendarOptions.events as any[] || [];
        let serverAppointments = this.orderAppointmentsByHourPipe.transform(res.appointments);

        this.calendarOptions.events = [...currentEvents,...serverAppointments.map((v:AppointmentI)=>{
          return {
            id:v._id,
            title:`${v.service && v.service.length > 0 ? v.service[0].name : 'Servicio no diponible'} `,
            start:v.dateAppointment,
            allDay:!0,
            classNames:[
              v.status=='Pending' ? 'dot-pending-event' :
              v.status=='Reserved'?'dot-reserved-event' : 
              v.status == "Confirmed" ?'dot-confirmed-event':
              v.status == "InProgress" ?'dot-inProgress-event':
              v.status == "pending_payment" ?'dot-pending_payment':
              v.status == "Completed" ?'dot-completed-event': 'dot-refuse-event'],
            extendedProps:{
              hour:v.hour,
              status:v.status,
              commentCancel:v.commentCancel,
              typeCancel:v.typeCancel,
              motivoCancel:v.motivoCancel,
              meetingTool:v.meetingTool,
              link:v.link,
              total: v.total,
              virtual: v.typeAppoinment.online
            }
          }
        })];

        this.datesRequested.push(dayjs(this.currentMonthDate).format('YYYY-MM-DD'));

        this.changeDetectorRef.detectChanges()
      })
    })
  }

  ngAfterViewInit(): void {
    this.calendarApi = this.calendarComponent.getApi();
  }

  prevMonthBtn(){
    this.calendarApi.prev();
    this.getAllAppointmentsByMonth()

  }

  nextMonthBtn(){
    this.calendarApi.next();
    this.getAllAppointmentsByMonth()

  }

  todayBtn(){
    this.calendarApi.today();
    this.getAllAppointmentsByMonth()

  }

  datesSet(dateSet:DatesSetArg){
    this.currentMonthDate =dateSet.view.currentStart
    if(this.userInfo){
      this.getAllAppointmentsByMonth();
    }
    if (!this.moreLinkClick) {
      const current = dateSet.view.title.split(' ')
      this.currentTitle = current[0] + ' '+ current[2];
      this.changeDetectorRef.detectChanges();
    }
  }

  async viewDetailAppointment(appointmentId:string){
    const modal = this.ngbModal.open(ViewDetailAppointmentModalComponent,{centered:true, size:'lg'});
    modal.componentInstance.appointment = {_id:appointmentId};

  }

  openViewAppoinments(dateClick:DateClickArg){   
    const modalRef = this.ngbModal.open(ViewAppoimentsModalComponent,{centered:true,size:'xl', scrollable:true});
    modalRef.componentInstance.currentDate = dateClick.date;
    modalRef.componentInstance.filters = this.filters;

    let reload = false;
    modalRef.componentInstance.reload.subscribe({
      next:((res:boolean)=>{
        reload = res;
      })
    })

    modalRef.hidden.subscribe({
      next:(()=>{
        if(reload){
          this.getAllAppointmentsByMonth();
        }
      })
    })
  }

  orderEvents(ev:any):any{
    let currentEvents = this.calendarOptions.events as any[];
    // return this.utilsService.orderAppointmentsCalendar(currentEvents);
  }

  changeStatusModal(appointment:EventClickArg){
    if(appointment.event.extendedProps['status'] === 'pending_payment'){
      const modal = this.ngbModal.open(PayAppointmentComponent,{centered:true});
      modal.componentInstance.status = appointment.event.extendedProps['status'];
      modal.componentInstance.appointmentId = appointment.event.id;
      modal.componentInstance.virtual = appointment.event.extendedProps['virtual'];
      modal.componentInstance.total = appointment.event.extendedProps['total'];

      modal.result.then((result)=>{
        if(result?.reload){
          this.getAllAppointmentsByMonth();
        }
      });
      return
    }


    if(appointment.event.extendedProps['status'] != 'Refuse' || this.userInfo?.roles?.[0]?.name === 'admin'){
      let isAdmin = this.userInfo?.roles?.[0]?.name ?? null
      if(isAdmin === 'admin' || isAdmin === 'sac'){

        const modal = this.ngbModal.open(ChangeStatusAppointmentModalComponent,{centered:true});
        modal.componentInstance.status = appointment.event.extendedProps['status'];
        modal.componentInstance.appointmentId = appointment.event.id;
        modal.componentInstance.typeCancel = appointment.event.extendedProps['typeCancel'];
        modal.componentInstance.commentCancel = appointment.event.extendedProps['commentCancel'];
        modal.componentInstance.motivoCancel = appointment.event.extendedProps['motivoCancel'];
        modal.componentInstance.appointment = {
          meetingTool:appointment.event.extendedProps['meetingTool'],
          link:appointment.event.extendedProps['link']
        }

        modal.result.then((result)=>{
          if(result && result.reload){
            this.getAllAppointmentsByMonth();
          }
        });
      }
    }
  }

  cleanFilter(){
    if(this.userInfo){
      this.filters = {user:this.userInfo?._id, roleUser:this.userInfo?.roles?this.userInfo?.roles[0].name:''}
      this.getAllAppointmentsByMonth(true)
     }
  }
}