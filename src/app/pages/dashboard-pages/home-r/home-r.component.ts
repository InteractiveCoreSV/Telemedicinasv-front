import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewAppointmentFormsService } from '../appointments-page/new-appointment-page/new-appointment-forms.service';
import { NewAppointmentModalComponent } from 'src/app/components/modals/appointments/new-appointment-modal/new-appointment-modal.component';
import { UserI } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/user.service';
import { finalize, tap } from 'rxjs';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { ViewTextComponent } from 'src/app/components/modals/view-text/view-text.component';
import { ViewDetailMedicoProfileComponent } from 'src/app/components/modals/view-detail-medico-profile/view-detail-medico-profile.component';
import { AuthService } from 'src/app/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-home-r',
  templateUrl: './home-r.component.html',
  styleUrls: ['./home-r.component.scss']
})
export class HomeRComponent {

  medicos:UserI[] = [];
  loading:boolean =true;
  paginationDetails!: PaginationDetailsI;

  page:number = 1;
  filter:any={favoritos:false};

  user!:UserI | null

  constructor(
    private ngbModal: NgbModal,
    private newAppointmentFormsService: NewAppointmentFormsService,
    private medicoService: UsersService,
    private authService: AuthService,
    private ngxSpinnerService: NgxSpinnerService,
    private alertService: AlertsService,
  ) { }

  ngOnInit(): void {
    this.getmedicos();  

    this.authService.getUserInfo().subscribe((user) => {
      this.user = user;
    });

    this.medicoService.getFavoriteDoctors().subscribe({
      next: (res: any) => {
        if (this.user) {
          this.user = { ...this.user, favoriteDoctors: res.favoriteDoctors };
          this.authService.userInfo.next(this.user);
        }
      }
    });
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

  openModalDetailMedico(doctor?: UserI){
    const modal = this.ngbModal.open(ViewDetailMedicoProfileComponent,{centered:true,size:'md',scrollable:true, backdrop:'static'});

    modal.componentInstance.doctor = doctor;

  }

  openAddressModal(title:string,text:string){
    const modal = this.ngbModal.open(ViewTextComponent,{centered:true,scrollable:true});
    modal.componentInstance.title = title;
    modal.componentInstance.text = text;
  }

  getmedicos(){
      this.loading = true;
      this.filter.forHome = true
      this.medicoService.getMedicos(this.page,this.filter).pipe(
        finalize(()=>{
          this.loading = false;
        })
      ).subscribe({
        next:((res:any)=>{
          this.medicos = res.medicos;
          this.paginationDetails = res.paginationDetails;
        })
      })
    }

   async addToFavorite(medicoId: any) {
    if (!this.user || !this.user._id) return;

    // Verificar si ya está en favoritos
    const isFavorite = this.user.favoriteDoctors?.some(
      (fav: any) => fav.doctorId === medicoId
    ) ?? false;

    await this.ngxSpinnerService.show('generalSpinner');

    this.medicoService.updateFavoriteDoctors(this.user._id, medicoId, !isFavorite).pipe(
      tap((res: any) => {
        localStorage.setItem('x-access-token', res['token']);
      }),
      finalize(async () => await this.ngxSpinnerService.hide('generalSpinner'))
    ).subscribe({
      next: (res: any) => {
        if (this.user) {
          // Actualizar la lista de favoritos con la respuesta del backend
          this.user.favoriteDoctors = res.updatedUser.favoriteDoctors;
          this.authService.userInfo.next(this.user);
        }
      },
      error: (e) => {
        console.error(e);
        this.alertService.toastMixin('Ocurrió un error al actualizar los favoritos', 'error');
      }
    });
  }

  isFavorite(doctorId: string): boolean {
    return this.user?.favoriteDoctors?.some(fav => fav?.doctorId === doctorId) ?? false;
  }

}
