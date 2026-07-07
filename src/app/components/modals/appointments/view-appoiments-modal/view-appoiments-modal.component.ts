import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ChangeStatusAppointmentModalComponent } from '../change-status-appointment-modal/change-status-appointment-modal.component';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { AppointmentI } from 'src/app/interfaces/appointment.interface';
import { Subscription, finalize } from 'rxjs';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ViewDetailAppointmentModalComponent } from '../view-detail-appointment-modal/view-detail-appointment-modal.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AuthService } from 'src/app/auth/auth.service';
import { UserI } from 'src/app/interfaces/user.interface';
import { ComponentsModule } from 'src/app/components/components.module';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { NewAppointmentFormsService } from 'src/app/pages/dashboard-pages/appointments-page/new-appointment-page/new-appointment-forms.service';
import { PayAppointmentComponent } from '../pay-appointment/pay-appointment.component';

@Component({
  selector: 'app-view-appoiments-modal',
  templateUrl: './view-appoiments-modal.component.html',
  standalone:true,
  imports:[
    DirectivesModule,
    CommonModule,
    ComponentsModule,
    NgbPaginationModule,
    PipesModule,
    NgxPermissionsModule
  ]
})
export class ViewAppoimentsModalComponent implements OnInit {

  loading:boolean = true;
  // appointments:any[] = [];
  appointments:AppointmentI[] = [];


  page:number = 1;
  paginationDetails?:PaginationDetailsI;

  @Input() currentDate!:Date;
  @Input() filters:any = {};
  userInfo!:UserI | null;
  subs:Subscription = new Subscription()

  @Input() currentMonthDate!:Date;
  @Input() forYear!:boolean;

  @Input() forCanceled:boolean = false;
  @Input() extraordinarias:boolean = false;
  @Input() reprogramadas:boolean = false;

  extraordinariasCount:number = 0

  @Output() reload:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private appointmentsService: AppointmentsService,
    private authService: AuthService,
    private newAppointmentFormsService: NewAppointmentFormsService
    
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.authService.getUserInfo().subscribe((userInfo:UserI|null)=>{
        this.userInfo = userInfo;
      })
    )

    this.selectToGet()

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

  selectToGet(){
    if(this.forCanceled){
      this.getAppointmentsCancelled24H();
      return
    }if(this.extraordinarias || this.reprogramadas){
      this.getAppointmentsExtraordinarias(this.extraordinarias ? 'extraordinarias' : this.reprogramadas ? 'reprogramadas' : '');
      return
    }else {
      this.getAppointments();    
      return  
    }
  }

  async viewDetailAppointment(appointment:AppointmentI){
    const modal = this.ngbModal.open(ViewDetailAppointmentModalComponent,{centered:true, size:'lg'});
    modal.componentInstance.appointment = appointment;

    try {
      const result = await modal.result;

      if(result.close){
        this.ngbActiveModal.close()
      } 
    } catch (error) {}

  }

  getAppointments(){
    this.loading = true;

    this.filters.userId = this.userInfo?._id; 
    this.filters.roleUser = this.userInfo?.roles ? this.userInfo?.roles[0].name : '';
    this.filters.user = null;

    this.appointmentsService.getAppointments(this.page,{date:this.currentDate,...this.filters}).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{
        this.appointments = res.appointments;
        this.extraordinariasCount = res.extraordinarias
        this.paginationDetails = res.paginationDetails;
      })
    })
  }

  getAppointmentsCancelled24H(){
    this.loading = true;
    this.appointmentsService.getAppointmentsCanceled24H(this.page,this.currentMonthDate.toString(), this.filters, this.forYear).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{
        this.appointments = res.appointments;
        this.paginationDetails = res.paginationDetails;
      })
    })
  }

  getAppointmentsExtraordinarias(type:string){
    this.loading = true;

    this.appointmentsService.getAppointmentsExtraordinarias(this.page,this.currentMonthDate.toString(), this.filters, this.forYear,type).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{
        this.appointments = res.appointments;
        this.paginationDetails = res.paginationDetails;
      })
    })
  }

  async changeStatusModal(appointment:AppointmentI){
    if(appointment.status === 'pending_payment'){
      this.payRequest(appointment)
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
          this.reload.emit(true);
          this.getAppointments();
        }
      } catch (error) {}
    }
  }

  async payRequest(appointment:AppointmentI){
    if(appointment.status === 'pending_payment'){
      const modal = this.ngbModal.open(PayAppointmentComponent,{centered:true});    
      modal.componentInstance.status = appointment.status;
      modal.componentInstance.appointmentId = appointment._id;
      modal.componentInstance.virtual = appointment.typeAppoinment?.online;
      modal.componentInstance.total = appointment.total;

      modal.result.then((result)=>{
        if(result?.reload){
          this.getAppointments();
          this.ngbActiveModal.close({reload:true})
        }
      });
    }

  }
}
