import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewAppointmentModalComponent } from 'src/app/components/modals/appointments/new-appointment-modal/new-appointment-modal.component';
import { NewAppointmentFormsService } from 'src/app/pages/dashboard-pages/appointments-page/new-appointment-page/new-appointment-forms.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls:['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  light:boolean=true;

  constructor(
    private ngbModal: NgbModal,
    private newAppointmentFormsService: NewAppointmentFormsService,

  ) { }

  ngOnInit(): void {
  }

  openModalNewAppoinment(){
    const modal = this.ngbModal.open(NewAppointmentModalComponent,{centered:true,size:'lg',scrollable:true, backdrop:'static'});
    modal.result.then((result)=>{
      if(result.reload){
        // this.newAppointmentFormsService.currentExtraServices$.next([]);
        this.newAppointmentFormsService.totalAppointment$.next(0);
      }
    }).catch(()=>{})
  }

  reloadPage() {
    window.location.reload();
  }
}
