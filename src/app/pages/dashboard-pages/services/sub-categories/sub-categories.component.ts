import { Component, HostListener, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoryServiceI, SubCategoryServiceI } from 'src/app/interfaces/service.interface';
import { ServiceService } from 'src/app/services/service.service';
import { NewSubCategoryComponent } from 'src/app/components/modals/services/new-sub-category/new-sub-category.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.scss']
})
export class SubCategoriesComponent {
  public isCollapsed = true;
  subCategoriesServices:SubCategoryServiceI[]=[];
  loading:boolean =true;
  paginationDetails!: PaginationDetailsI;

  page:number = 1;

  filters:any={};
  search:string='';

  constructor(
    private subCategoriesServicesService: ServiceService,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private ngbModal: NgbModal,

  ) { }

  ngOnInit(): void {
    this.getsubCategoriesServices();
  }

  getsubCategoriesServices(){
    this.loading =true;
    this.subCategoriesServicesService.getSubCategoriesServices(this.page,this.filters).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        this.subCategoriesServices = res.serviceSubCategories;
        this.paginationDetails = res.paginationDetails;
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  async changeStatus(idCategorieService:string,currentStatus:boolean){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas ${currentStatus?'desactivar':'activar'} esta sub categoría?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.subCategoriesServicesService.changeSubCategoryStatus(idCategorieService).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getsubCategoriesServices();
        },
        error:(e)=>{
          console.log(e)
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

  openModalNewSubCategory(edit?:SubCategoryServiceI){
    const modal = this.ngbModal.open(NewSubCategoryComponent,{centered:true,size:'md',scrollable:true, backdrop:'static'});
    
    if(edit){
      modal.componentInstance.toEdit = edit
      modal.componentInstance.title = 'Editar'
    }
   
    modal.result.then((result)=>{
      if(result.reload){
        this.getsubCategoriesServices()
      }
    }).catch(()=>{})
  }


  async deleteCategorieService(idCategorieService:string){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas eliminar esta sub categoría?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.subCategoriesServicesService.deleteSubCategoryService(idCategorieService).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getsubCategoriesServices();
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
    this.getsubCategoriesServices()
  }

}
