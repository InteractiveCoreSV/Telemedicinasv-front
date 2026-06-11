import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { EspecialidadI } from 'src/app/interfaces/especialidad.interface';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { NewEspecialidadComponent } from './modals/new-especialidad/new-especialidad.component';

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.component.html',
  // styleUrls: ['./especialidades.component.scss']
})
export class EspecialidadesComponent  implements OnInit {

  public isCollapsed = true;
  especialidades:EspecialidadI[]=[];
  loading:boolean =true;
  paginationDetails!: PaginationDetailsI;

  page:number = 1;

  filters:any={};
  search:string='';

  constructor(
    private especialidadService: EspecialidadService,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private ngbModal: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getEspecialidades();
  }

  getEspecialidades(){
    this.loading =true;
    this.especialidadService.getEspecialidades(this.page,this.filters).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        this.especialidades = res.especialidades;
        this.paginationDetails = res.paginationDetails;
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  async changeStatus(idEspecialidad:string,currentStatus:boolean){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas ${currentStatus?'desactivar':'activar'} esta especialidad?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.especialidadService.changeStatus(idEspecialidad).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getEspecialidades();
        },
        error:(e)=>{
          console.log(e)
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

  openModalNewEspecialidad(edit?: EspecialidadI){
    const modal = this.ngbModal.open(NewEspecialidadComponent,{centered:true,size:'md',scrollable:true, backdrop:'static'});
    
    if(edit){
      modal.componentInstance.toEdit = edit
      modal.componentInstance.title = 'Editar'
    }

    modal.result.then((result)=>{
      if(result.reload){
        this.getEspecialidades()
      }
    }).catch(()=>{})
  }


  async deleteEspecialidad(idEspecialidad:string){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas eliminar esta especialidad?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.especialidadService.deleteEspecialidad(idEspecialidad).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getEspecialidades();
        },
        error:(e)=>{
          console.log(e)
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }


  clearFilters(){
    this.filters = {}
    this.getEspecialidades()
  }

}
