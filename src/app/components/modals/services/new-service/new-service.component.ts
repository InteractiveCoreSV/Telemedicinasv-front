import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';
import { ServiceService } from 'src/app/services/service.service';
@Component({
  selector: 'app-new-service',
  templateUrl: './new-service.component.html',
  styleUrls: ['./new-service.component.scss']
})
export class NewServiceComponent implements OnInit {

  serviceForm!: FormGroup;
  formSubmited: boolean = false;

  @Input() toEdit!:any;
  @Input() title:string = "Nuevo";
  
  category!: (string | undefined)[] ;
  subCategory!: string | null| undefined;

  price:any

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
      this.serviceForm.patchValue(this.toEdit);
      this.category = this.toEdit.category.map((c:any) => c._id)
      this.subCategory = this.toEdit && this.toEdit.subCategory ? this.toEdit.subCategory._id : null;

      this.serviceForm.get('category')?.setValue(this.category);
      this.serviceForm.get('subCategory')?.setValue(this.subCategory);
    }
  }

  createForm(): void {
    this.serviceForm = this.fb.group({
      _id: [''],
      name: ['', [Validators.required]],
      price: ['0.00', [Validators.required, Validators.pattern('^[0-9]*\.[0-9]{2}$')]] ,// Solo valores con 2 decimales
      subCategory: ['', []],
      category: ['', [Validators.required]],
      description: ['', [Validators.required]],
    })
    
    if(!this.toEdit){
      this.serviceForm.get('_id')?.disable();
    }
  }

  // Este método maneja la entrada de texto del campo
  formatPriceOnInput(event: any): void {
    let value = event.target.value;
    // Eliminar cualquier carácter no numérico, exceptuando el punto decimal
    value = value.replace(/[^0-9]/g, '');

    // Si el valor no tiene decimales, agregar ".00"
    if (value === '') {
      this.serviceForm.get('price')?.setValue('0.00');
      return;
    }
    const numericValue = parseFloat(value) / 100;

    // Actualizar el valor en el formulario
    this.price = numericValue.toFixed(2);

    const valueFloat = parseFloat(this.price);
    this.serviceForm.get('price')?.setValue(isNaN(valueFloat) ? 0.00 : valueFloat.toFixed(2));
  }

  // setCategory(category:any){
  //   console.log('category',category)
  //   this.serviceForm.get('category')?.setValue(category)

  //   console.log(this.category.includes(category))
  //   this.category.push(category)
  // }

  setCategory(category:(string | undefined)[]){
    this.serviceForm.get('category')?.setValue(category)
    this.category = category
  }

  setSubCategory(subCategory:any){
    this.serviceForm.get('subCategory')?.setValue(subCategory)
  }

  async newService(){
    this.formSubmited = true;
    if(this.serviceForm.valid){

      await this.ngxSpinnerService.show('generalSpinner');
      this.serviceService.newService(this.serviceForm.value).pipe(
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

  async editService(){
    this.formSubmited = true;
    if(this.serviceForm.valid){

      await this.ngxSpinnerService.show('generalSpinner');
      this.serviceService.editService(this.serviceForm.value).pipe(
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
