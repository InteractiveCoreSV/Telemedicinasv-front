import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal,{SweetAlertIcon, SweetAlertResult} from 'sweetalert2';

declare const Cropper:any;

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(private toastrService: ToastrService) { }

  async toastMixin(title:string,icon:'success' | 'error' | 'warning' | 'info',timer:number=3000):Promise<any>{

    if(icon == 'success'){
      this.toastrService.success(title, '', {
        timeOut: timer,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }

    if(icon == 'error'){
      this.toastrService.error(title, '', {
        timeOut: timer,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }

    if(icon == 'warning'){
      this.toastrService.warning(title, '', {
        timeOut: timer,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }

    if(icon == 'info'){
      this.toastrService.warning(title, '', {
        timeOut: timer,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
  }

  async confirmDialogWithModals(title:string,text:string,icon:SweetAlertIcon){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass:{
        confirmButton:'btn btn-success',
        cancelButton:'btn btn-danger'
      },
      buttonsStyling:false
    });

    const result = await swalWithBootstrapButtons.fire({
      title,
      text,
      icon,
      showCancelButton:true,
      confirmButtonText:'Sí, continuar',
      cancelButtonText:'No, cancelar',
      reverseButtons:true
    });
    return {result,swalWithBootstrapButtons};
  }

  async confirmDialogWithModalsWithCheckBox(title:string,text:string,textCheckBox:string,icon:SweetAlertIcon){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass:{
        confirmButton:'btn btn-success',
        cancelButton:'btn btn-danger'
      },
      buttonsStyling:false
    });

    const result = await swalWithBootstrapButtons.fire({
      title,
      text,
      icon,
      input: 'checkbox',
      inputValue: 0,
      inputPlaceholder:textCheckBox,
      showCancelButton:true,
      confirmButtonText:'Sí, continuar',
      cancelButtonText:'No, cancelar',
      reverseButtons:true
    });

    return {result,swalWithBootstrapButtons};

  }

  async alertInputFile(title:string = 'Seleccione el archivo',accept:string = 'image/*'){
    const { value: file } = await Swal.fire({
      title,
      input: 'file',
      confirmButtonText:'Aceptar',
      inputAttributes: {
        'accept': accept,
        'aria-label': 'Seleccione el archivo'
      }
    });

   return file;
  }

  async alertInputFileCroper(src:string,cropperOptions:any={},idPreview:string = 'preview',title:string = 'Adapta tu foto de pefil'){
    const { value: file } = await Swal.fire({
      title,
      html: `
      <img id="${idPreview}" src="${src}">
      <div>
        <img id="cropperjs" src="${src}">
      </div>
      `,
      confirmButtonText:'Continuar',
      confirmButtonColor:'var(--bs-success)',
      showCancelButton:true,
      cancelButtonText:'Cancelar',
      cancelButtonColor:'var(--bs-danger)',
      reverseButtons:true,
      // width:'100%',
      willOpen:()=>{
        const image = Swal.getPopup()?.querySelector('#cropperjs')
        const cropper = new Cropper(image, {
          ...cropperOptions,
          crop: this.throttle(function () {
            const croppedCanvas = cropper.getCroppedCanvas()
            const preview:any = Swal.getHtmlContainer()?.querySelector('#'+idPreview)
            preview.src = croppedCanvas.toDataURL()
          }, 25)
        })
      },
      preConfirm:()=>{
        return (Swal.getHtmlContainer()?.querySelector('#'+idPreview) as any).src;
      }
    });

   return file;
  }

  private throttle(cb:any, delay = 0) {
    let shouldWait = false
    let waitingArgs:any;
    const timeoutFunc = () => {
      if (waitingArgs == null) {
        shouldWait = false
      } else {
        cb(...waitingArgs)
        waitingArgs = null
        setTimeout(timeoutFunc, delay)
      }
    }

    return (...args:any[]) => {
      if (shouldWait) {
        waitingArgs = args
        return
      }

      cb(...args)
      shouldWait = true
      setTimeout(timeoutFunc, delay)
    }
  }

  async appointmentSuccess(title:string = 'Pago procesado',text:string = 'Tu cita ha sido reservada con exito'){
    await Swal.fire({
      title:title,
      text:text,
      icon:'success',
      confirmButtonColor:'var(--bs-primary)',
      confirmButtonText:'Aceptar'
    })
  }

  async warning(title:string,text:string){
    await Swal.fire({
      title:title,
      text:text,
      icon:'warning',
      confirmButtonColor:'var(--bs-primary)',
      confirmButtonText:'Aceptar'
    })
  }
}
