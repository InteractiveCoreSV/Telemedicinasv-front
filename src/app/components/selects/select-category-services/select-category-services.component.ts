import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { finalize } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';

import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { CategoryServiceI } from 'src/app/interfaces/service.interface';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-select-category-services',
  templateUrl: './select-category-services.component.html',
  styles: [
  ]
})
export class SelectCategoryServiceComponent implements OnInit {

  @ViewChild(NgSelectComponent) ngSelectComponent!:NgSelectComponent;

  loading:boolean = false;

  @Input() categoriesServicesSelected!:string | null | undefined;

  categoriesServices:CategoryServiceI[]=[];

  page:number=1;
  paginationDetails!:PaginationDetailsI;

  @Input()search!:string;
  @Input() manualSearch:boolean = false;

  searched:boolean =false;

  @Output() changecategoriesServices:EventEmitter<string | null> = new EventEmitter<string | null>();

  constructor(
    private categoriesServicesService: ServiceService,
    private alertsService: AlertsService
  ) { }

  ngOnInit(): void {   
    this.getCategoriesServices();
  }

  getCategoriesServices(){
    this.loading = true;
    this.categoriesServicesService.getCategoriesServices(this.page).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        if(this.ngSelectComponent.itemsList.filteredItems.length==0 && this.searched){
          // this.beforeSearchcategoriesServices = this.categoriesServices;
          this.categoriesServices = [];
        }

        this.categoriesServices = this.categoriesServices.concat(res.serviceCategoris);
        this.paginationDetails = res.paginationDetails;

        if(this.paginationDetails.hasNextPage){
          this.page += this.page;
        }
      },
      error:(e:any)=>{
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  selectedCategoriesServices(){

    if(!this.categoriesServicesSelected && this.searched){
      this.searched = false;
    }

    this.changecategoriesServices.emit(this.categoriesServicesSelected)
  }

  keydownInDropdown(event:any){

    if(event.keyCode ==13){
      if(this.ngSelectComponent.itemsList.filteredItems.length==0){
        this.page = 1;
        this.searched = true;
        this.getCategoriesServices();
      }
    }
    return false;
  }

  setSearch(ev:any){
    this.search = ev.term;
  }

  clear(){
    this.categoriesServicesSelected = null;
  }

  setDefaultValue(value:any){
    this.categoriesServicesSelected = value;
  }

  onScrollToEnd() {
    this.getCategoriesServices();
  }

}
