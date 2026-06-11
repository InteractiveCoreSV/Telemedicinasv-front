import { Directive, Output, ElementRef, EventEmitter } from '@angular/core';
import { AlertsService } from '../services/alerts.service';


@Directive({
  selector: '[inputFile]',
  host: { "(change)": 'onInputChange($event)' }
})
export class InputFileDirective {

  @Output() imgTemp: EventEmitter<string | ArrayBuffer> = new EventEmitter<string | ArrayBuffer>();
  @Output() imgFile: EventEmitter<File> = new EventEmitter<File>();

  constructor(
    private alertService:AlertsService,
    private elementRef: ElementRef,

  ) { }

  onInputChange(event:any) {

    const file = event.target['files'][0];
    if (!file) {

      return;
    }
    if (!file || !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {

      return;
    }
    if(file.size > 5500000){
      this.alertService.toastMixin('La imagen no debe superar los 5Mb','error')
      // this.matSnackBar.open("La imagen no debe superar los 5Mb",'CERRAR',{duration:3000});
      return ;
    }
    try {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (fileURL:any) => {
        this.imgFile.emit(file);
        this.imgTemp.emit(fileURL.target.result);
      };
    } catch (e) {

    }
  }

}
