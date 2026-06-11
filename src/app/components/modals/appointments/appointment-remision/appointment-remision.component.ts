import { Component, Input, OnInit } from '@angular/core';
import { Fancybox } from '@fancyapps/ui';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AppointmentI } from 'src/app/interfaces/appointment.interface';
import { NewAppointmentFormsService } from 'src/app/pages/dashboard-pages/appointments-page/new-appointment-page/new-appointment-forms.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { ViewDocumentComponent } from '../view-document/view-document.component';
import { SelectServiceModalComponent } from 'src/app/pages/dashboard-pages/appointments-page/new-appointment-page/select-service-modal/select-service-modal.component';
import { ServiceI } from 'src/app/interfaces/service.interface';
import { VideoConferenciaI } from 'src/app/interfaces/video-conferencia.interface';
import { VideoConferenciaService } from 'src/app/services/video-conferencia.service';

@Component({
  selector: 'app-appointment-remision',
  templateUrl: './appointment-remision.component.html',
  styleUrls: ['./appointment-remision.component.scss']
})
export class AppointmentRemisionComponent  implements OnInit {

  @Input() appointment!: AppointmentI
  @Input() newVirtual: boolean = false
  submited: boolean = false

  videoConferencia:VideoConferenciaI[] = []

  urgencies:any[] = [
    {
      _id: '1',
      name: 'Leve',
      color: 'rgba(0, 195, 42, 1)'
    },
    {
      _id: '2',
      name: 'Grave',
      color: 'rgba(255, 184, 32, 1)'
    },    {
      _id: '3',
      name: 'Urgente',
      color: 'rgba(234, 72, 80, 1)'
    },
  ];


  constructor(
    public ngbActiveModal: NgbActiveModal,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private appointmentService: AppointmentsService,
    private ngbModal: NgbModal,
    private newAppointmentFormsService: NewAppointmentFormsService,
    private videoConferenciaService: VideoConferenciaService,
  ) { }

  ngOnInit(): void {
    this.getvideoConferencia();
  }

  async reagendar(){
    this.submited = true

    if(this.newVirtual && !this.appointment.meetingTool){
      this.alertsService.toastMixin('Seleccione la herramienta para la video llamada','warning');
      return
    }

    await this.ngxSpinnerService.show('generalSpinner');

    this.appointmentService.reprogramarAppointment(this.appointment).pipe(
      finalize(async()=>{
        await this.ngxSpinnerService.hide('generalSpinner');
      })
    ).subscribe({
      next:((res:any)=>{
        this.alertsService.appointmentSuccess('Remitida');
        this.appointmentService.updateAppointmets$.next(true);
        this.ngbActiveModal.close()
      }),
      error:((e:any)=>{
        this.alertsService.toastMixin(e.error.message,'error');
      })
    });
  }

  getvideoConferencia(){
    this.videoConferenciaService.getVideoConferencias(1,'true').subscribe({
      next:(res:any)=>{
        this.videoConferencia = res.videoConferencias;
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
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

  openModalSelectService(){
    const modal = this.ngbModal.open(SelectServiceModalComponent,{centered:true,size:'md',scrollable:true, backdrop:'static'});

    modal.componentInstance.category = this.appointment.typeAppoinment._id

    modal.componentInstance.servicesAppointment = this.appointment.service.map(s => s._id)
    modal.componentInstance.servicesSelected = this.appointment.service
    modal.componentInstance.changeCurrentServices = true

    modal.result.then((result)=>{
      if(result.service){
        this.appointment.service = result.service
        const services:ServiceI[] = this.appointment.service
        this.appointment.total = 0; 
        services.forEach(s => {
          this.appointment.total = this.appointment.total + Number(s.price);
        });

      }
    }).catch(()=>{})
    
  }
}
