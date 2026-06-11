import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as mammoth from 'mammoth';
import { Fancybox } from '@fancyapps/ui';
import { finalize } from 'rxjs';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-vew-document-expediente',
  templateUrl: './vew-document-expediente.component.html',
  styleUrls: ['./vew-document-expediente.component.scss']
})
export class VewDocumentExpedienteComponent implements OnInit {
  @Input() url!: string;
  @Input() typeDocument!: string;
  @Input() comment!: string;
  @Input() name!: string;
  @Input() expedienteId!: string;
  @Input() createByFichaMedica: boolean = false;
  @Input() category!: string;


  documentContent: string = '';
  loading: boolean = true;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private expedienteService: ExpedienteService,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    if(this.typeDocument == 'image') {
      this.loading = false;
    }

    if(this.typeDocument == 'pdf' && this.url?.startsWith('blob:')) {
      this.loading = false;
    }

    if(this.typeDocument == 'word'){
      // Proxy through backend to avoid S3 CORS restrictions
      this.utilsService.getImageAsBase64(this.url).subscribe({
        next: (res: any) => {
          const dataUrl: string = res.img;
          const base64 = dataUrl.split(',')[1];
          const binary = atob(base64);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          mammoth.convertToHtml({ arrayBuffer: bytes.buffer })
            .then(result => {
              this.documentContent = result.value;
              this.loading = false;
            })
            .catch(err => {
              console.error(err);
              this.loading = false;
            });
        },
        error: err => {
          console.error(err);
          this.loading = false;
        }
      });
    }

    if(this.typeDocument == 'pdf' && this.url && !this.url.startsWith('blob:')){
      const s3Url = this.url;
      this.url = '';
      this.utilsService.getImageAsBase64(s3Url).subscribe({
        next: (res: any) => {
          const dataUrl: string = res.img;
          const base64 = dataUrl.split(',')[1];
          const binary = atob(base64);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([bytes.buffer], { type: 'application/pdf' });
          this.url = window.URL.createObjectURL(blob);
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.loading = false;
        }
      });
    }

    if(this.typeDocument == 'pdf' && this.createByFichaMedica && this.category === 'Tratamiento' && !this.url){
      this.descargarTratamientoPDF()
    }

    if(this.typeDocument == 'pdf' && this.createByFichaMedica && this.category === 'Estudio' && !this.url){
      this.descargarEstudioPDF()
    }
  }

  async descargarTratamientoPDF(){
    this.expedienteService.generatePDFTratamiento(this.expedienteId).pipe(
      finalize(async()=>{})
    ).subscribe({
      next:(res:any)=>{
        const blob = new Blob([res.body!], { type: 'application/pdf' });
        this.url = window.URL.createObjectURL(blob);
        this.loading = false;
      },
      error:(e)=>{
        console.log(e);
        this.loading = false;
      }
    })
  }

  async descargarEstudioPDF(){
    this.expedienteService.generatePDFEstudio(this.expedienteId).subscribe({
      next:(res:any)=>{
        const blob = new Blob([res.body as ArrayBuffer], { type: 'application/pdf' });
        this.url = window.URL.createObjectURL(blob);
        this.loading = false;
      },
      error:(e)=>{
        console.log(e);
        this.loading = false;
      }
    })
  }

  viewAtt(src:any){
    new Fancybox(
      [
        {
          src: src,
          type: "image",
        },
      ]
    );
  }

}
