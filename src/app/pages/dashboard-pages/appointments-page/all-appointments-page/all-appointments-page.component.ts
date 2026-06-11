import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, finalize } from 'rxjs';
import { AppointmentI } from 'src/app/interfaces/appointment.interface';
import { AppointmentsService } from 'src/app/services/appointments.service';

import { Hours2I } from 'src/app/interfaces/hours.interface';
import * as dayjs from 'dayjs';
import { UserI } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from 'src/app/services/utils.service';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';  // Importa el idioma español
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { ViewDetailAppointmentModalComponent } from 'src/app/components/modals/appointments/view-detail-appointment-modal/view-detail-appointment-modal.component';
import { ChangeStatusAppointmentModalComponent } from 'src/app/components/modals/appointments/change-status-appointment-modal/change-status-appointment-modal.component';
import { Calendar } from '@fullcalendar/core';
import { InsertLinkVideoconferenciaComponent } from 'src/app/components/modals/appointments/insert-link-videoconferencia/insert-link-videoconferencia.component';
import { NewAppointmentFormsService } from '../new-appointment-page/new-appointment-forms.service';
import { PayAppointmentComponent } from 'src/app/components/modals/appointments/pay-appointment/pay-appointment.component';

declare const $: any; // declare jQuery

@Component({
  selector: 'app-all-appointments-page',
  templateUrl: './all-appointments-page.component.html',
  styleUrls: ['./all-appointments-page.component.scss']
})
export class AllAppointmentsPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('datePicker') datePickerRef!: ElementRef;

  loading:boolean = true;
  appointments:any[] = [];

  page:number = 1;
  paginationDetails?:PaginationDetailsI;

  filters:any = {};

  hoursObj:Hours2I[] = [];

  userInfo!:UserI | null;
  subs:Subscription = new Subscription()

  countAppointments:any[] = []

  currentTitle:string='';

  currentMonth =  new Date();
  startDate:any = null;
  endDate:any = null;
  btnCancelSearchByDates:boolean = false;

  noFilter:boolean = false

  typingTimer: any

  constructor(
    private ngbModal: NgbModal,
    private activatedRoute: ActivatedRoute,
    private appointmentsService: AppointmentsService,
    public router: Router,
    private authService: AuthService,
    private newAppointmentFormsService: NewAppointmentFormsService
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.authService.getUserInfo().subscribe((userInfo:UserI|null)=>{
        this.userInfo = userInfo;
        if(this.userInfo ){
          this.configFilters();
          this.getCurrentMonthDateRange()
          this.getAppointments();
        }
      })
    )

       
    this.subs.add(
      this.newAppointmentFormsService.appointmentRegistered$.subscribe(newAppointment => {
        if(newAppointment){
          this.getAppointments()
        }
      })
    )

    this.subs.add(
      this.appointmentsService.updateAppointmets$.subscribe(update => {
        if(update){
          this.getAppointments()
        }
      })
    )
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  prevMonthBtn(){
    this.filters.rangeDates = this.getCurrentMonthDateRange(-1)
    this.getAppointments()
  }

  nextMonthBtn(){
    this.filters.rangeDates = this.getCurrentMonthDateRange(1)
    this.getAppointments()
  }

  todayBtn(){
    this.currentMonth = new Date()

    this.filters.rangeDates = this.getCurrentMonthDateRange()
    this.getAppointments()
  }

  getCurrentMonthDateRange(monthAdjustment?: number): { from: Date; to: Date } {
    if(monthAdjustment){
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + monthAdjustment, 1);
    }

    // Primer día del mes actual
    const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);

    // Último día del mes actual
    const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    this.currentTitle = this.currentMonth.toLocaleDateString('es-ES', { month: 'long' }) + ' ' + this.currentMonth.getFullYear();

    return {
      from: firstDay,
      to: lastDay
    };
  }

  configFilters(){
    const filters = this.activatedRoute.snapshot.data['filters'];

    this.noFilter = filters?.status === 'Pending' || filters?.status === 'Reserved' ? true :false
    this.filters = {
      ...filters, 
      userId:this.userInfo?._id, 
      roleUser:this.userInfo?.roles?this.userInfo?.roles[0].name:'',
      rangeDates: this.getCurrentMonthDateRange()
    };
  }

  changeFilters(){

    this.filters = {
      ...this.filters, 
      rangeDates: {
        from: this.startDate,
        to: this.endDate
      }
    }

    this.getAppointments();
  }

  searchWithoutDates(){
    this.startDate = null;
    this.endDate = null;
    this.currentMonth = new Date();
    this.filters = {
      ...this.filters,
      rangeDates: this.getCurrentMonthDateRange()
    };
    this.btnCancelSearchByDates = false;
    this.getAppointments();
  }

  getForSearch(){
    this.page = 1
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }

    // Iniciar un nuevo temporizador
    this.typingTimer = setTimeout(() => {
      this.getAppointments();
    }, 700);
  }

  getAppointments(){
    this.loading = true;
    
    this.appointmentsService.getAppointments(this.page,this.filters).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{
        this.countAppointments = []
        this.appointments = res.appointments;
        this.paginationDetails = res.paginationDetails;
      })
    })
  }

  viewDetailAppointment(appointment:AppointmentI){
    const modal = this.ngbModal.open(ViewDetailAppointmentModalComponent,{centered:true,size:'md'});
    modal.componentInstance.appointment = appointment;

  }

  async changeStatusModal(appointment:AppointmentI){
    if(appointment.status === 'pending_payment'){
      const modal = this.ngbModal.open(PayAppointmentComponent,{centered:true});
      modal.componentInstance.status = appointment.status;
      modal.componentInstance.appointmentId = appointment._id;
      modal.componentInstance.virtual = appointment.typeAppoinment.online;
      modal.componentInstance.total = appointment.total;

      modal.result.then((result)=>{
        if(result?.reload){
          this.getAppointments();
        }
      });
      return
    }

    if( appointment.status != 'Refuse' || this.userInfo?.roles?.[0]?.name === 'admin'){
      const modal = this.ngbModal.open(ChangeStatusAppointmentModalComponent,{centered:true});
      modal.componentInstance.status = appointment.status;
      modal.componentInstance.appointmentId = appointment._id;
      modal.componentInstance.typeCancel = appointment.typeCancel;
      modal.componentInstance.motivoCancel = appointment.motivoCancel;
      modal.componentInstance.commentCancel = appointment.commentCancel;
      modal.componentInstance.appointment = appointment

      try {
        const result = await modal.result;
        if(result.reload){
          this.getAppointments();
        }
      } catch (error) {}
    }
   
  }

  openModalInsertLink(appointment: AppointmentI){
    const modal = this.ngbModal.open(InsertLinkVideoconferenciaComponent,{centered:true,scrollable:true, backdrop:'static'});

    modal.componentInstance.appointment = appointment

    modal.result.then((result)=>{
      if(result.reload){
        this.getAppointments()
      }
    }).catch(()=>{})
  }

  applyFilters(){
    this.page = 1;
    this.getAppointments();
  }

  clearFilters(){
    this.page = 1;
    this.filters ={};
    this.configFilters()
    this.getAppointments();
  }

  getValueDateHour(){
    if(this.filters?.date && this.filters?.hours?.length>0){
      return `${dayjs(this.filters.date).format('D/M/YYYY')}; ${this.hoursObj?.map((v:Hours2I)=>`  ${v.hours}`)}`
    }

    if(this.filters?.date){
      return `${dayjs(this.filters.date).format('D/M/YYYY')}`
    }
    return '';
  }

}
