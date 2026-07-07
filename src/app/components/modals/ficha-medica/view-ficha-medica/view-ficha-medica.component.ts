import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { ViewDocumentComponent } from 'src/app/components/modals/appointments/view-document/view-document.component';
import { AlertsService } from 'src/app/services/alerts.service';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { FichaMedicaService } from 'src/app/services/ficha-medica.service';


@Component({
  selector: 'app-view-ficha-medica',
  templateUrl: './view-ficha-medica.component.html',
  styleUrls: ['./view-ficha-medica.component.scss']
})
export class ViewFichaMedicaComponent {

  loading:boolean = true;

  @Input() fichaMedica: any;

  ngbModal = inject(NgbModal);
  ngxSpinnerService = inject(NgxSpinnerService);
  alertsService = inject(AlertsService);
 
  constructor(   
    private expedienteService: ExpedienteService,
    public ngbActiveModal: NgbActiveModal,
    private fichaMedicaService: FichaMedicaService,
  ) {}

  ngOnInit() {   
  }

  isDui(typeDocument: string): boolean {
    return typeDocument !== 'Pasaporte' && typeDocument !== 'ID internacional';
  }

  formatPhoneNumber(phone: string | number): string {
    if (!phone) return '';
    const digits = phone.toString().replace(/\D/g, '');
    const localNumber = digits.length > 8 ? digits.slice(-8) : digits;
    return `+503 ${localNumber}`;
  }

  openModalViewDocument(url:string,key:string){
    const modal = this.ngbModal.open(ViewDocumentComponent,{centered:true,size:'xl',scrollable:true});
    modal.componentInstance.url = url
    modal.componentInstance.typeDocument = 'pdf'
    modal.componentInstance.name = key
  }

  descargarPDF(url:string,name:string,typeDocument:string){
    this.expedienteService.downloadDocumentExpediente(url,`${name}.${typeDocument ==  'pdf' ? 'pdf' : typeDocument ==  'word' ? 'docx' :'png' }`);
  }

  async descargarEstudioPDF(idFichaMedica: string, estudioId: string) {
    await this.ngxSpinnerService.show('generalSpinner');

    this.fichaMedicaService.generateEstudioPDF(idFichaMedica, estudioId).pipe(
      finalize(async () => {
        await this.ngxSpinnerService.hide('generalSpinner');
      })
    ).subscribe({
      next: (res: any) => {
        const contentDisposition = res.headers.get('Content-Disposition');
        let fileName = 'estudio.pdf';

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) fileName = match[1];
        }

        const blob = new Blob([res.body!], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (e) => {
        console.log(e);
        this.alertsService.toastMixin(e['error']['message'], 'error');
      }
    });
  }

  async descargarTratamientoPDF(idFichaMedica:string,tratamientoId:string){
    await this.ngxSpinnerService.show('generalSpinner');

    this.fichaMedicaService.generatePDFTratamiento(idFichaMedica,tratamientoId).pipe(
      finalize(async()=>{
        await this.ngxSpinnerService.hide('generalSpinner');
      })  
    ).subscribe({
      next:(res:any)=>{
        const contentDisposition = res.headers.get('Content-Disposition');
        let fileName = '';

   if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) {
            fileName = match[1];
          }
        }

        const blob = new Blob([res.body!], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }
}
