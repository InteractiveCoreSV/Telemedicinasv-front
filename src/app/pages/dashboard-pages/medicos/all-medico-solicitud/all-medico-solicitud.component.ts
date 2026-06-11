import { Component, HostListener, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { ChangeStatusSolicitudMedicoComponent } from 'src/app/components/modals/solicitud-medico/change-status-solicitud-medico/change-status-solicitud-medico.component';
import { CreateNewMedicoComponent } from 'src/app/components/modals/solicitud-medico/create-new-medico/create-new-medico.component';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { SolicitudMedicoI } from 'src/app/interfaces/solicitud-medico.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { SolicitudMedicoService } from 'src/app/services/solicitud-medico.service';

@Component({
  selector: 'app-all-medico-solicitud',
  templateUrl: './all-medico-solicitud.component.html',
  styleUrls: ['./all-medico-solicitud.component.scss']
})
export class AllMedicoSolicitudComponent implements OnInit {

  public isCollapsed = true;
  medicos:SolicitudMedicoI[]=[];
  loading:boolean =true;
  paginationDetails!: PaginationDetailsI;

  page:number = 1;

  filters:any={};
  search:string='';
  roleSelected:string ='';

  windowWidth:number =0;

  constructor(
    private medicosService: SolicitudMedicoService,
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
    this.medicosService.getSolicitudMedicos(this.page,this.filters).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        this.medicos = res.solicitudMedicos;
        this.paginationDetails = res.paginationDetails;
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  async changeStatusModal(medico:SolicitudMedicoI){
    const modal = this.ngbModal.open(ChangeStatusSolicitudMedicoComponent,{centered:true});
    modal.componentInstance.status = medico.status;
    modal.componentInstance.medicoId = medico._id;
    modal.componentInstance.medico = medico

    try {
      const result = await modal.result;
      if(result.reload){
        this.getMedicos();
      }
    } catch (error) {}
  
  }

  async createMedicoModal(medico:SolicitudMedicoI){
    const modal = this.ngbModal.open(CreateNewMedicoComponent,{centered:true, size:'lg',scrollable:true});
    modal.componentInstance.solicitudMedico = medico

    try {
      const result = await modal.result;
      if(result.reload){
        this.getMedicos();
      }
    } catch (error) {}
  
  }


  async deleteMedico(idMedico:string){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas eliminar esta solicitud de médico?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.medicosService.deleteSolicitudMedico(idMedico).pipe(
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

  clearFilters(){
    this.filters = {}
    this.getMedicos()
  }

  @HostListener('window:resize')
  onResize(){
    this.windowWidth = window.innerWidth;
  }

}
