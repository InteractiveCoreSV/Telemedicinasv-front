import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AppointmentI } from 'src/app/interfaces/appointment.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { ServiceService } from 'src/app/services/service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-insert-link-videoconferencia',
  templateUrl: './insert-link-videoconferencia.component.html',
  styleUrls: ['./insert-link-videoconferencia.component.scss']
})
export class InsertLinkVideoconferenciaComponent implements OnInit {

  @Input() appointment!:AppointmentI;
  idAppointment:any
  
  loading:boolean = true;

  constructor(
    private fb: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    public ngbActiveModal: NgbActiveModal,
    private alertsService: AlertsService,
    private appointmentsService: AppointmentsService
  ) { }

  ngOnInit(): void {
    this.idAppointment = this.appointment._id
    this.loading = true
    this.appointmentsService.getAppointmentById(this.appointment._id).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{
        this.appointment = res.appointment;
      })
    })
  }

  async inisertLink(){

    if(this.appointment.link){

      await this.ngxSpinnerService.show('generalSpinner');

      const data = {
        idAppointment: this.idAppointment, 
        link:this.appointment.link
      }

      this.appointmentsService.insertLinkVideoconferencia(data).pipe(
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner')
        })
      ).subscribe({
        next: (res: any) => {
          this.alertsService.toastMixin(res.message,'success',2000);
          this.ngbActiveModal.close({reload:true})
        },
        error: (e:any) =>{
          const message = e['error']['message'];
          this.alertsService.toastMixin(message?message:'Ocurrió un error','error');
        }
      })

    }else {
      this.alertsService.toastMixin('Inserte el enlace para continuar','warning',2000);
    }
    
  }

}
