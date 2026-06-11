import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { format } from 'date-fns';
import { AppointmentI } from 'src/app/interfaces/appointment.interface';
import { InsertLinkVideoconferenciaComponent } from '../insert-link-videoconferencia/insert-link-videoconferencia.component';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-change-status-appointment-modal',
  templateUrl: './change-status-appointment-modal.component.html',
  standalone:true,
  imports:[
    FormsModule,
    NgxPermissionsModule,
    CommonModule,
    NgSelectModule
  ]
})
export class ChangeStatusAppointmentModalComponent implements OnInit {

  @Input() status:string = '';
  @Input() appointmentId:string = '';
  @Input() appointment!:AppointmentI;

  optionSelected: string = '';

  currentRole!: string
  @Input() commentCancel!: string
  @Input() typeCancel!: string
  @Input() motivoCancel!: string

  motivos:string[] = [
    'Fallos en el internet',
    'Paciente no confirmo la cita',
    'Paciente no contestó la llamada',
    'Cita fue reprogramada',
    'Otros motivos',
  ]

  formSubmited:boolean = false

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private appointmentsService: AppointmentsService,
    private authService: AuthService,
    private ngbModal: NgbModal

  ) { }

  ngOnInit(): void {
    this.optionSelected = this.status;

    const roles = this.authService.userInfo.value?.roles
    this.currentRole =  roles && roles?.length > 0 ? roles[0].name : ''
  }

  async changeStatus(){
    this.formSubmited = true

    if(this.currentRole === 'client'){
      this.typeCancel = 'client'
    }

    if(this.formSubmited &&  !this.typeCancel && this.optionSelected == 'Refuse'){
      this.alertsService.toastMixin('Selecione una opcion para poder continuar','warning',4000)
      return
    }

    if(this.formSubmited && !this.motivoCancel && this.typeCancel === 'interno' && this.optionSelected == 'Refuse'){
      this.alertsService.toastMixin('El comentario es requerido para poder cancelar la cita','warning',4000)
      return
    }

    if(this.formSubmited && !this.commentCancel && this.motivoCancel === 'Otros motivos' && this.optionSelected == 'Refuse'){
      this.alertsService.toastMixin('El comentario es requerido para poder cancelar la cita','warning',4000)
      return
    }
    
    if(this.appointment.meetingTool && !this.appointment.link && this.optionSelected != 'Refuse'){
      this.openModalInsertLink(this.appointment)
      return
     }

    this.funtionChangeStatus()
  }

  async openModalInsertLink(appointment: AppointmentI){
    const modal = this.ngbModal.open(InsertLinkVideoconferenciaComponent,{centered:true,scrollable:true, backdrop:'static'});

    modal.componentInstance.appointment = appointment

    modal.result.then((result)=>{
      if(result.reload){
        this.funtionChangeStatus()
      }
    }).catch(()=>{})
  }

  async funtionChangeStatus(){
    let dateAndHourCancel:any = {}

    if( this.optionSelected == 'Refuse'){
      const ahora = new Date();

      const fechaActual = ahora.toISOString();
  
      const horaMilitar = format(ahora, 'HH');
  
      const hora12Horas = format(ahora, 'hh:mm a');
  
      dateAndHourCancel = {
        fechaActual:fechaActual,
        horaMilitar:horaMilitar,
        hora12Horas:hora12Horas
      }
    }

    this.formSubmited = true
    await this.ngxSpinnerService.show('generalSpinner');
    this.appointmentsService.changeStatus(this.appointmentId,this.optionSelected, this.typeCancel,this.commentCancel, dateAndHourCancel, this.motivoCancel).pipe(
      finalize(async()=>{
        await this.ngxSpinnerService.hide('generalSpinner');
      })
    ).subscribe({
      next:((res:any)=>{
        this.alertsService.toastMixin(res.message,'success');
        this.appointmentsService.updateAppointmets$.next(true);
        this.ngbActiveModal.close()
      }),
      error:((e:any)=>{
        this.alertsService.toastMixin(e.error.message,'error');
      })
    })
  }

}
