import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { NewAppointmentPageModule } from 'src/app/pages/dashboard-pages/appointments-page/new-appointment-page/new-appointment-page.module';
import { NewAppointmentFormsService } from 'src/app/pages/dashboard-pages/appointments-page/new-appointment-page/new-appointment-forms.service';

declare const $:any;
declare const HSStepForm:any;

@Component({
  selector: 'app-new-appointment-modal',
  templateUrl: './new-appointment-modal.component.html',
  standalone:true,
  imports:[
    CommonModule,
    ComponentsModule,
    NewAppointmentPageModule
  ],
  styleUrls:['./new-appointment-modal.component.scss']
})
export class NewAppointmentModalComponent implements OnInit {
  registerUser:boolean = false

  subs:Subscription = new Subscription();

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private newAppointmentFormsService: NewAppointmentFormsService
    ) { }

    ngOnInit(): void {
      this.subs.add(
        this.newAppointmentFormsService.appointmentRegistered$.subscribe({
          next:((res:any)=>{
            if(res){
              this.ngbActiveModal.close({reload:true});
              this.newAppointmentFormsService.appointmentRegistered$.next(false);
            }
          })
        })
      );
    }
  
    ngOnDestroy(): void {
      this.subs.unsubscribe();
    }
  
    closeModal(){
      this.ngbActiveModal.close({reload:false});
      this.newAppointmentFormsService.medicoDisponible$.next(null);
      this.newAppointmentFormsService.reset();
    }
}
