import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgxDropzoneComponent } from 'ngx-dropzone';
// import { Fancybox} from "@fancyapps/ui";
import { AlertsService } from '../../services/alerts.service';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styles: [
  ]
})
export class DropzoneComponent implements OnInit {

  @ViewChild('dropzone') dropzone!:NgxDropzoneComponent;

  @Input() showOrder:boolean =true;
  @Input() files: File[] = [];
  @Input() accept:string='image/jpeg,image/png,image/gif';
  @Input() multiple:boolean = true;
  @Input() maxFile:number = 10;
  @Input() label:string = 'Suelta o selecciona los archivos';
  @Input() dimensionState!:boolean;
  @Input() btn:boolean = true;
  @Input() dimensionesImg:any;
  @Input() max_height!:string;
  @Input() max_width!:string;
  @Input() logo:boolean = false;

  @Output() filesOutput:EventEmitter<File[]> = new EventEmitter<File[]>();
  @Output() photoPrincipalIndex:EventEmitter<number> = new EventEmitter<number>();

  imgTemp!:any;
  videoTemp:any;
  pdfTemp:any;

  videoPreview!:HTMLElement | null;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private alertsService: AlertsService
    ) { }

  ngOnInit(): void {
    this.videoPreview = document.getElementById("videoPreview");
  }

  onSelect(event:any) {
    if(this.files.length<this.maxFile){
      this.files.push(...event.addedFiles);
      this.filesOutput.emit(this.files);
      this.files
    }
  }

  onRemove(event:any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.filesOutput.emit(this.files);
  }

  preview(i:number){
    const file:File = this.files[i];
    const type = file.type;

    if(file){
      const reader = new FileReader();
      reader.readAsDataURL(file);
    if(type.includes('image')){
      reader.onload = (fileURL) => {
        this.imgTemp = fileURL.target?.result;
        this.changeDetectorRef.detectChanges();
  
      };
    }else if(type.includes('pdf')){
      reader.onload = (fileURL)=>{
        this.pdfTemp = fileURL.target?.result;
      }
    }
  }
  }

  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  // Método para obtener la URL de vista previa de la imagen
  getImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }


}
