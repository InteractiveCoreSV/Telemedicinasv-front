import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UserI } from 'src/app/interfaces/user.interface';
import { NewAppointmentModalComponent } from 'src/app/components/modals/appointments/new-appointment-modal/new-appointment-modal.component';
import { NewAppointmentFormsService } from 'src/app/pages/dashboard-pages/appointments-page/new-appointment-page/new-appointment-forms.service';
// import { NewAppointmentFormsService } from 'src/app/pages/appointments-page/new-appointment-page/new-appointment-forms.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls:['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  light:boolean = false;

  perfilPhoto!:string | undefined;
  userInfo!:UserI | null;
  subs:Subscription = new Subscription()

  constructor(
    public router: Router,
    private authService: AuthService,
    private ngbModal: NgbModal,
    private newAppointmentFormsService: NewAppointmentFormsService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.authService.getUserInfo().subscribe((userInfo:UserI | null)=>{
       if(userInfo){
        this.userInfo = userInfo;
        this.perfilPhoto = this.userInfo?.imageProfile;
        this.changeDetectorRef.detectChanges();
       }
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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

 
  signout() {
    this.authService.logout();
    // this.router.navigateByUrl('/auth/');
  }


}
