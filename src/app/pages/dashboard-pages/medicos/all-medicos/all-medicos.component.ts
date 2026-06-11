import { Component, HostListener, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserI } from 'src/app/interfaces/user.interface';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { UsersService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewHorarioForDoctorComponent } from 'src/app/components/modals/new-horario-for-doctor/new-horario-for-doctor.component';

@Component({
  selector: 'app-all-medicos',
  templateUrl: './all-medicos.component.html',
  styleUrls: ['./all-medicos.component.scss']
})
export class AllMedicosComponent implements OnInit {

  public isCollapsed = true;
  medicos:UserI[]=[];
  loading:boolean =true;
  paginationDetails!: PaginationDetailsI;

  page:number = 1;

  filters:any={};
  search:string='';
  roleSelected:string ='';

  windowWidth:number =0;

  constructor(
    private medicosService: UsersService,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private ngbModal: NgbModal
  ) { }

  ngOnInit(): void {
    this.getMedicos();
    this.windowWidth = window.innerWidth;
  }

  getMedicos(){
    this.loading =true;
    this.medicosService.getMedicos(this.page,this.filters).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        this.medicos = res.medicos;
        this.paginationDetails = res.paginationDetails;
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  async changeStatusMedico(idMedico:string,currentStatus:boolean){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas ${currentStatus?'desactivar':'activar'} este médico?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.medicosService.changeStatus(idMedico).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getMedicos();
        },
        error:(e)=>{
          console.log(e)
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

  async deleteMedico(idMedico:string,currentStatus:boolean){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas eliminar este médico?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.medicosService.deleteMedico(idMedico).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getMedicos();
        },
        error:(e)=>{
          console.log(e)
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

  openModalNewHorarioForDoctor(doctor: UserI){
    const modal = this.ngbModal.open(NewHorarioForDoctorComponent,{centered:true,size:'xl',scrollable:true, backdrop:'static'});
    
    modal.componentInstance.doctor = doctor

    // modal.result.then((result)=>{
    //   if(result.reload){
    //     this.getservices()
    //   }
    // }).catch(()=>{})
  }

  clearFilters(){
    this.filters = {}
    this.getMedicos()
  }

  @HostListener('window:resize')
  onResize(){
    this.windowWidth = window.innerWidth;
  }

}
