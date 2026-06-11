import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { CategoryServiceI, SubCategoryServiceI } from 'src/app/interfaces/service.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-new-sub-category',
  templateUrl: './new-sub-category.component.html',
  styleUrls: ['./new-sub-category.component.scss']
})
export class NewSubCategoryComponent implements OnInit {

  subCategoryForm!: FormGroup;
  formSubmited: boolean = false;

  @Input() toEdit!:SubCategoryServiceI;
  @Input() title:string = "Nueva"
  
  category: (string | undefined)[] = [];

  constructor(
    private fb: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    public ngbActiveModal: NgbActiveModal,
    private alertsService: AlertsService,
    private serviceService: ServiceService
  ) { }

  ngOnInit(): void {
    this.createForm()

    if(this.toEdit){
      this.subCategoryForm.patchValue(this.toEdit)
      if(this.toEdit && this.toEdit.category){
        this.category = this.toEdit.category.map(c => c._id)
      }
    }
  }

  createForm(): void {
    this.subCategoryForm = this.fb.group({
      _id: [''],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
    })

    if(!this.toEdit){
      this.subCategoryForm.get('_id')?.disable();
    }
  }

  setCategory(category:(string | undefined)[]){
    this.subCategoryForm.get('category')?.setValue(category)
  }

  async newSubCategoryService(){
    this.formSubmited = true;

    if(this.subCategoryForm.valid){

      await this.ngxSpinnerService.show('generalSpinner');
      this.serviceService.newSubCategoryService(this.subCategoryForm.value).pipe(
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner')
        })
      ).subscribe({
        next: (res: any) => {
          this.alertsService.toastMixin(res.message,'success',2000);
          this.formSubmited = false;
          this.ngbActiveModal.close({reload:true})
        },
        error: (e) =>{
          const message = e['error']['message'];
          this.alertsService.toastMixin(message?message:'Ocurrió un error','error');
        }
      })
    }
  }

  async editSubCategoryService(){
    this.formSubmited = true;
    if(this.subCategoryForm.valid){

      await this.ngxSpinnerService.show('generalSpinner');
      this.serviceService.editSubCategoryService(this.subCategoryForm.value).pipe(
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner')
        })
      ).subscribe({
        next: (res: any) => {
          this.alertsService.toastMixin(res.message,'success',2000);
          this.formSubmited = false;
          this.ngbActiveModal.close({reload:true})
        },
        error: (e:any) =>{
          const message = e['error']['message'];
          this.alertsService.toastMixin(message?message:'Ocurrió un error','error');
        }
      })

    }
    
  }
}
