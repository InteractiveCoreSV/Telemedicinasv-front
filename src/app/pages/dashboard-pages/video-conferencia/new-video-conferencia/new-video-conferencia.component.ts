import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { VideoConferenciaI } from 'src/app/interfaces/video-conferencia.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { VideoConferenciaService } from 'src/app/services/video-conferencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-video-conferencia',
  templateUrl: './new-video-conferencia.component.html',
  styleUrls: ['./new-video-conferencia.component.scss']
})
export class NewVideoConferenciaComponent implements OnInit {

  videoConferenciaForm!:FormGroup;
  formSubmited:boolean = false;

  videoConferenciaToEdit!: VideoConferenciaI;

  strongPassword = false;

  dimensiones:any={
    maxWidth:150,
    minWidth:150,
    maxHeigth:150,
    minHeigth:150
  }

  imgs:File[] = []

  constructor(
    private formBuilder: FormBuilder,
    private videoConferenciaService: VideoConferenciaService,
    private alertsService: AlertsService,
    private router: Router,
    private ngxSpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.createForm();
    this.videoConferenciaToEdit = history.state?.videoConferencia;

    if(this.videoConferenciaToEdit){
      this.setEditVideoConferencia();
    }
  }


  getErrorMessageName(){
    const full_name = this.videoConferenciaForm.get('name');
    if(full_name?.hasError('required')){
      return 'El nombre es requerido'
    }

    return ''
  }

  createForm(){
    this.videoConferenciaForm = this.formBuilder.group({
      _id:[null,[Validators.required]],
      name:['',[Validators.required]],
      description:['',[Validators.required]],
    });

    this.videoConferenciaForm.get('_id')?.disable();
  }


  async createVideoConferencia(){
    this.formSubmited = true;

    if(this.imgs.length == 0){
      this.alertsService.toastMixin('La imagen es necesaria','warning');
      return
    }

    if(this.videoConferenciaForm.valid){
      await this.ngxSpinnerService.show('generalSpinner');

      const videoConferenciaData = new FormData();
      const data = this.videoConferenciaForm.value;
  
      videoConferenciaData.append('name',data.name);
      videoConferenciaData.append('description',data.description);
      videoConferenciaData.append('img',this.imgs[0]);

      this.videoConferenciaService.newVideoConferencia(videoConferenciaData).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin(res['message'],'success');
          this.router.navigate(['/dashboard/video-conferencias'],{replaceUrl:true})
        },
        error:(e)=>{
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

  async editVideoConferencia(){
    this.formSubmited = true;
    if(this.videoConferenciaForm.valid){
      await this.ngxSpinnerService.show('generalSpinner');

      this.videoConferenciaService.editVideoConferencia({...this.videoConferenciaForm.value}).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin(res['message'],'success');
          this.videoConferenciaForm.reset();
          this.formSubmited = false;

          this.router.navigate(['/dashboard/video-conferencias'],{replaceUrl:true})
        },
        error:(e)=>{
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

  setEditVideoConferencia(){
    this.videoConferenciaForm.get('_id')?.enable();
    this.videoConferenciaForm.patchValue(this.videoConferenciaToEdit);
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
          
          const newFile = this.renameFile(file,'herramienta-video-conferencia'+this.videoConferenciaToEdit._id);

          await this.ngxSpinnerService.show('generalSpinner');

          const formData = new FormData();
          formData.append('img',file);

          this.videoConferenciaService.uploadImg(formData,this.videoConferenciaToEdit._id?this.videoConferenciaToEdit._id:'').pipe(
            finalize(async()=>{
              await this.ngxSpinnerService.hide('generalSpinner');
            })
          ).subscribe({
            next:(res:any)=>{

              this.videoConferenciaToEdit.img.location = res.img;

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
