import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { ReloadsDataService } from 'src/app/services/reloads-data.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceI, SubCategoryServiceI } from 'src/app/interfaces/service.interface';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-select-service-modal',
  templateUrl: './select-service-modal.component.html',
  styleUrls: ['./select-service-modal.component.scss']
})
export class SelectServiceModalComponent implements OnInit {

  formSubmited:boolean = false;

  serviceForm!:FormGroup;

  loading:boolean = false;
  @Input() servicesSelected: ServiceI[] = []
  @Input() servicesAppointment: string[] = []
  @Input() changeCurrentServices: boolean = false

  servicesBySubcategory:SubCategoryServiceI[] = [];
  serviceFilters:SubCategoryServiceI[] = []

  loadingOtherServices:boolean = false;
  otherServices:ServiceI[] = []
  otherServiceFilters:ServiceI[] = []

  subs:Subscription = new Subscription();

  @Input() category!:string[]

  inputFilter = new FormControl('');
  idSubcategory!:string | null

  constructor(
    private formBuilder: FormBuilder,
    private change: ChangeDetectorRef,
    private serviceService: ServiceService,
    private reloadsDataService: ReloadsDataService,
    public ngbActiveModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.getServices();
    this.getOtherServices();

    // if(this.serviceSelect) this.getControl('service')?.setValue(this.serviceSelect)
    // this.change.detectChanges()

    this.inputFilter.valueChanges.subscribe(value => {
      this.filtrarDatos(value);
    });
  }

  getControl(name:string){
    return this.serviceForm.get(name);
  }

  createForm(){
    this.serviceForm = this.formBuilder.group({
      service:[null,[Validators.required]],
    });

  }

  getServices(){
    this.loading = true;
    this.serviceService.getServicesForNewAppointmentBySubCategory(this.category).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{
        this.servicesBySubcategory = res.serviceSubCategories;
      })
    })
  }

  getOtherServices(){
    this.loadingOtherServices = true;
    this.serviceService.getOtherService(this.category).pipe(
      finalize(()=>{
        this.loadingOtherServices = false;
      })
    ).subscribe({
      next:((res:any)=>{
        this.otherServices = res.services;
      })
    })
  }

  filtrarDatos(value: any) {
    this.serviceFilters = []
    this.otherServiceFilters = []

    this.servicesBySubcategory.map(data =>{

      let info = data.services?.filter(service =>
        service.name.toLowerCase().includes(value.toLowerCase())
      )

      if(info && info.length > 0){
        this.serviceFilters.push({
          _id:data._id,
          name: data.name,
          description: data.description,
          category: data.category,
          services: info,
          status:data.status,
        })
      }
    });


     this.otherServices.map(service =>{
      if(service.name.toLowerCase().includes(value.toLowerCase())){
        this.otherServiceFilters.push(service)
      }
     });

  }

  FilterByCategory(idSubcategory:any){
    this.idSubcategory = idSubcategory
    
    this.serviceFilters = []

    this.servicesBySubcategory.map(data =>{
      if(data._id == idSubcategory){
        this.serviceFilters.push(data)
      }
    }); 
  }

  setService(){
    this.formSubmited = true;
    if(this.servicesSelected.length > 0){
      this.ngbActiveModal.close({service:this.servicesSelected});
    }
  }

  setValue(name:string,value:any){
    this.serviceForm.get(name)?.setValue(value);
  }


  selectService(service:ServiceI){
    if(this.servicesSelected.some(s => s._id === service._id)){
      this.servicesSelected = this.servicesSelected.filter(s => s._id != service._id)
    }else {
      this.servicesSelected.push(service)
    }

      // if (this.servicesSelected.length && this.servicesSelected[0]._id === service._id) {
      //   this.servicesSelected = [];
      // } else {
      //   // Siempre reemplaza con el nuevo servicio
      //   this.servicesSelected = [service];
      // }
  }
}
