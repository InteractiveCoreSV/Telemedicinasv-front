import { Component, Input, OnInit } from '@angular/core';
import { Fancybox } from '@fancyapps/ui';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AppointmentI } from 'src/app/interfaces/appointment.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { ViewDocumentComponent } from '../view-document/view-document.component';
import { NewAppointmentFormsService } from 'src/app/pages/dashboard-pages/appointments-page/new-appointment-page/new-appointment-forms.service';

@Component({
  selector: 'app-confirm-reagenda-cita',
  templateUrl: './confirm-reagenda-cita.component.html',
  styleUrls: ['./confirm-reagenda-cita.component.scss']
})
export class ConfirmReagendaCitaComponent implements OnInit {

  @Input() appointment!: AppointmentI

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private appointmentService: AppointmentsService,
    private ngbModal: NgbModal,
    private newAppointmentFormsService: NewAppointmentFormsService,
  ) { }

  ngOnInit(): void {
  }

  async reagendar(){
    await this.ngxSpinnerService.show('generalSpinner');
    
    this.appointmentService.reprogramarAppointment(this.appointment).pipe(
      finalize(async()=>{
        await this.ngxSpinnerService.hide('generalSpinner');
      })
    ).subscribe({
      next:((res:any)=>{
        this.alertsService.appointmentSuccess('Reprogramación');
        this.newAppointmentFormsService.appointmentRegistered$.next(true);

        this.ngbActiveModal.close()
      }),
      error:((e:any)=>{
        this.alertsService.toastMixin(e.error.message,'error');
      })
    });
  }

    viewAtt(src:any){
      new Fancybox(
        [
          {
            src: src,
            type: "image",
          },
        ]
      );
    }

      openModalViewDocument(url:string,key:string){
        const modal = this.ngbModal.open(ViewDocumentComponent,{centered:true,size:'xl',scrollable:true});
        modal.componentInstance.url = url
        modal.componentInstance.typeDocument = 'pdf'
        modal.componentInstance.name = key
      }
}
