import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserI } from 'src/app/interfaces/user.interface';
import { NewAppointmentModalComponent } from '../appointments/new-appointment-modal/new-appointment-modal.component';
import { NewAppointmentFormsService } from 'src/app/pages/dashboard-pages/appointments-page/new-appointment-page/new-appointment-forms.service';

@Component({
  selector: 'app-view-detail-medico-profile',
  templateUrl: './view-detail-medico-profile.component.html',
  styleUrls: ['./view-detail-medico-profile.component.scss']
})
export class ViewDetailMedicoProfileComponent implements OnInit{
  @Input() doctor!:UserI;
  @Input() botonAgenda:boolean = true;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private newAppointmentFormsService: NewAppointmentFormsService
  ) { }

  ngOnInit(): void {
    
  }

   openModalNewAppoinment(medico?: UserI){
      const modal = this.ngbModal.open(NewAppointmentModalComponent,{centered:true,size:'lg',scrollable:true, backdrop:'static'});
     
      if(medico){
        this.newAppointmentFormsService.medicoDisponible$.next(medico);
      }
  
      modal.result.then((result)=>{
        if(result.reload){
          // this.newAppointmentFormsService.currentExtraServices$.next([]);
          this.newAppointmentFormsService.totalAppointment$.next(0);
        }
      }).catch(()=>{})
    }
  
}
