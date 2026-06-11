import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { finalize } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';

import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { CategoryServiceI, SubCategoryServiceI } from 'src/app/interfaces/service.interface';
import { ServiceService } from 'src/app/services/service.service';
@Component({
  selector: 'app-select-sub-category-service',
  templateUrl: './select-sub-category-service.component.html',
  styleUrls: ['./select-sub-category-service.component.scss']
})
export class SelectSubCategoryServiceComponent implements OnInit {

  @ViewChild(NgSelectComponent) ngSelectComponent!:NgSelectComponent;

  loading:boolean = false;

  @Input() subCategoriesServicesSelected!:string | null | undefined;
  @Input() subCategoriesServicesStatus:string='true';
  @Input() placeholder:string = 'Primero selecciona la categoría';


  // @Input() formGroup!:FormGroup;
  // @Input() formControlNameSubcategory!:string;

  subCategoriesServices:SubCategoryServiceI[]=[]; 
  
  @Input() category!:any[];
  
  page:number=1;
  paginationDetails!:PaginationDetailsI;

  @Input()search!:string;
  @Input() manualSearch:boolean = false;

  searched:boolean =false;

  @Output() changeSubcategoriesServices:EventEmitter<string | null> = new EventEmitter<string | null>();


  @Input()apliChange!: boolean
  
  constructor(
    private subCategoriesServicesService: ServiceService,
    private alertsService: AlertsService
  ) { }

  ngOnInit(): void {
    if(this.category){
      this.getsubCategoriesServices()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['category']){
      if(this.category && this.apliChange === true){
        this.placeholder = 'Selecciona la sub categoría'
        this.subCategoriesServices = []
        this.subCategoriesServicesSelected = null
        this.filter();
      }else if(!this.category){
        this.clear()
      }
    }
  }

  filter(){
    
    if(this.category){
      this.getsubCategoriesServices()
    }else{
      this.clear();
    }
  }

  getsubCategoriesServices(){
    this.loading = true;

    this.subCategoriesServicesService.getSubCategoriesServices(this.page,{status:'true',category:this.category}).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{

        if(this.ngSelectComponent.itemsList.filteredItems.length==0 && this.searched){
          // this.beforeSearchsubCategoriesServices = this.subCategoriesServices;
          this.subCategoriesServices = [];
        }

        this.subCategoriesServices = this.subCategoriesServices.concat(res.serviceSubCategories);
        this.paginationDetails = res.paginationDetails;

        if(this.paginationDetails.hasNextPage){
          this.page += this.page;
        }

        this.apliChange = true
      },
      error:(e:any)=>{
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  selectedsubCategoriesServices(){

    if(!this.subCategoriesServicesSelected && this.searched){
      this.searched = false;
    }

    this.changeSubcategoriesServices.emit(this.subCategoriesServicesSelected)
  }

  keydownInDropdown(event:any){

    if(event.keyCode ==13){
      if(this.ngSelectComponent.itemsList.filteredItems.length==0){
        this.page = 1;
        this.searched = true;
        this.getsubCategoriesServices();
      }
    }
    return false;
  }

  setSearch(ev:any){
    this.search = ev.term;
  }

  clear(){
    this.subCategoriesServices = []
    this.subCategoriesServicesSelected = null  
    this.placeholder = 'Primero selecciona la categoría'
  }

  setDefaultValue(value:any){
    this.subCategoriesServicesSelected = value;
  }

  onScrollToEnd() {
    this.getsubCategoriesServices();
  }

}
