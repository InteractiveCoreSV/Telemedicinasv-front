import { Component, HostListener, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoryServiceI } from 'src/app/interfaces/service.interface';
import { ServiceService } from 'src/app/services/service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewCategoryComponent } from 'src/app/components/modals/services/new-category/new-category.component';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
  public isCollapsed = true;
  categoriesServices:CategoryServiceI[]=[];
  loading:boolean =true;
  paginationDetails!: PaginationDetailsI;

  page:number = 1;

  filters:any={};
  search:string='';

  constructor(
    private categoriesServicesService: ServiceService,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private ngbModal: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getcategoriesServices();
  }

  getcategoriesServices(){
    this.loading =true;
    this.filters.status = 'all'
     this.categoriesServicesService.getCategoriesServices(this.page,this.filters).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        this.categoriesServices = res.serviceCategoris;
        this.paginationDetails = res.paginationDetails;
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  openModalNewCategory(edit?:CategoryServiceI){
    const modal = this.ngbModal.open(NewCategoryComponent,{centered:true,size:'md',scrollable:true, backdrop:'static'});

    if(edit){
      modal.componentInstance.toEdit = edit;
      modal.componentInstance.title = 'Editar'
    }

    modal.result.then((result)=>{
      if(result.reload){
        this.getcategoriesServices()
      }
    }).catch(()=>{})
  }

  async changeStatus(idCategorieService:string,currentStatus:boolean){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas ${currentStatus?'desactivar':'activar'} esta categoría?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.categoriesServicesService.changeCategoryStatus(idCategorieService).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getcategoriesServices();
        },
        error:(e)=>{
          console.log(e)
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

  async deleteCategorieService(idCategorieService:string){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas eliminar esta categoría?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.categoriesServicesService.deleteCategoryService(idCategorieService).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getcategoriesServices();
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
    this.getcategoriesServices()
  }

}

