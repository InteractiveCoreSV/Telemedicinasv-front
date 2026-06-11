import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';
import { ServiceService } from 'src/app/services/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss']
})
export class NewCategoryComponent implements OnInit {

  categoryForm!: FormGroup;
  formSubmited: boolean = false;

  @Input() toEdit!:any;
  @Input() title!:string

  dimensiones:any={
    maxWidth:150,
    minWidth:150,
    maxHeigth:150,
    minHeigth:150
  }

  imgs:File[] = []
  
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
      this.categoryForm.patchValue(this.toEdit)
    }
  }

  createForm(): void {
    this.categoryForm = this.fb.group({
      _id: [''],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      online: [false, [Validators.required]],
    })

    if(!this.toEdit){
      this.categoryForm.get('_id')?.disable();
    }
  }

  async newCategoryService(){
    this.formSubmited = true;
    if(this.imgs.length == 0){
      this.alertsService.toastMixin('La imagen es necesaria','warning');
      return
    }

    if(this.categoryForm.valid){

      await this.ngxSpinnerService.show('generalSpinner');

      const categoryData = new FormData();
      const data = this.categoryForm.value;
  
      categoryData.append('name',data.name);
      categoryData.append('description',data.description);
      categoryData.append('online',data.online);
      categoryData.append('img',this.imgs[0]);

      this.serviceService.newCategoryService(categoryData).pipe(
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

  async editCategoryService(){
    this.formSubmited = true;
    if(this.categoryForm.valid){

      await this.ngxSpinnerService.show('generalSpinner');
      this.serviceService.editCategoryService(this.categoryForm.value).pipe(
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

  async changeimg(){
    let changeVerify: boolean = true

    const { value: file } = await Swal.fire({
      title: 'Seleccione la imagen',
      input: 'file',
      inputAttributes: {
        'accept': 'image/*',
        'aria-label': 'Seleccione la imagen',
      },
      confirmButtonText:'Continuar'
    })
    
    if (file) {
      const reader = new FileReader()
      reader.onload = async(e) => {

        await Swal.fire({
          title:'Previsualización de la imagen',
          imageUrl:e.target?.result?.toString(),
          imageAlt:'Previsualización de la imagen',
          confirmButtonText:'Continuar'
        });

        const {result} = await this.alertsService.confirmDialogWithModals('Info.','¿Desea actualizar la imagen de la herramienta?','question');

        if(result.isConfirmed && changeVerify){
          
          const newFile = this.renameFile(file,'herramienta-video-conferencia'+this.toEdit._id);

          await this.ngxSpinnerService.show('generalSpinner');

          const formData = new FormData();
          formData.append('img',file);

          this.serviceService.uploadImg(formData,this.toEdit._id?this.toEdit._id:'').pipe(
            finalize(async()=>{
              await this.ngxSpinnerService.hide('generalSpinner');
            })
          ).subscribe({
            next:(res:any)=>{

              this.toEdit.photo.location = res.img;

              this.alertsService.toastMixin(res.message,'success');
            },
            error:(e:any)=>{
              this.alertsService.toastMixin(e.error.message,'error');
            }
          });
        }else {
          this.alertsService.toastMixin('La imagen no cumple con los requerimientos','error');
        }
      }
      reader.readAsDataURL(file);
    }
  }

  renameFile(originalFile:any, newName:any) {
    return new File([originalFile], newName, { type: originalFile.type, lastModified: originalFile.lastModified, });
  };
}
