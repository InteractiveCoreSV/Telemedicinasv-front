import { Component, HostListener, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoryServiceI, ServiceI } from 'src/app/interfaces/service.interface';
import { ServiceService } from 'src/app/services/service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewServiceComponent } from 'src/app/components/modals/services/new-service/new-service.component';


@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.component.html',
  styleUrls: ['./all-services.component.scss']
})
export class AllServicesComponent implements OnInit {

  public isCollapsed = true;
  services:ServiceI[]=[];
  loading:boolean =true;
  paginationDetails!: PaginationDetailsI;

  page:number = 1;

  filters:any={};
  search:string='';

  constructor(
    private servicesService: ServiceService,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private ngbModal: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getservices();
  }

  getservices(){
    this.loading =true;
    this.servicesService.getServices(this.page,this.filters).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        this.services = res.services;
        this.paginationDetails = res.paginationDetails;
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  async changeStatus(idservice:string,currentStatus:boolean){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas ${currentStatus?'desactivar':'activar'} este servicio?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.servicesService.changeStatus(idservice).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getservices();
        },
        error:(e)=>{
          console.log(e)
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

  openModalNewService(edit?: ServiceI){
    const modal = this.ngbModal.open(NewServiceComponent,{centered:true,size:'md',scrollable:true, backdrop:'static'});
    
    if(edit){
      modal.componentInstance.toEdit = edit
      modal.componentInstance.title = 'Editar'
    }

    modal.result.then((result)=>{
      if(result.reload){
        this.getservices()
      }
    }).catch(()=>{})
  }


  async deleteservice(idservice:string){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas eliminar este servicio?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.servicesService.deleteService(idservice).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getservices();
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
    this.getservices()
  }

}
