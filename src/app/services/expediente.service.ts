import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from './utils.service';

const UTL_DOCUMENT_EXPEDIENTE = environment.urlApi+'/documents-expediente';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {

  constructor(
    private httpClient:HttpClient,
    private ngxSpinnerService: NgxSpinnerService,
    private utilsService: UtilsService,
  ) { }

  saveDocumentExpediente(data:FormData){
    return this.httpClient.post(`${UTL_DOCUMENT_EXPEDIENTE}/saveDocument`,data);
  }

  editDocument(data:FormData){
    return this.httpClient.post(`${UTL_DOCUMENT_EXPEDIENTE}/editDocument`,data);
  }

  editMedico(data:FormData){
    return this.httpClient.post(`${UTL_DOCUMENT_EXPEDIENTE}/editMedico`,data);
  }

  getDocumentExpedientesUser(_id:string, category:any, page:number,nameDocumment:string){
    return this.httpClient.get(`${UTL_DOCUMENT_EXPEDIENTE}/getDocumentsExpedienteByPatient`,{params:{_id,category,page,nameDocumment}})
  }
  
  combertToPDF(url:string){
    return this.httpClient.get(`${UTL_DOCUMENT_EXPEDIENTE}/combertToPDF`,{params:{url}})
  }

  generatePDFTratamiento(expedienteId:string){
    return this.httpClient.get(`${UTL_DOCUMENT_EXPEDIENTE}/generatePDFTratamiento`,{params:{expedienteId}, responseType: 'blob',
            observe: 'response'});
  }

  generatePDFEstudio(expedienteId:string){
    return this.httpClient.get(`${UTL_DOCUMENT_EXPEDIENTE}/generatePDFEstudio`,{params:{expedienteId}, responseType: 'arraybuffer',
            observe: 'response'});
  }

  async downloadDocumentExpediente(url: string, name: string) {
    await this.ngxSpinnerService.show('generalSpinner');
    this.utilsService.getImageAsBase64(url).pipe(
      finalize(async () => {
        await this.ngxSpinnerService.hide('generalSpinner');
      })
    ).subscribe({
      next: (res: any) => {
        const dataUrl: string = res.img;
        const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const base64 = dataUrl.split(',')[1];
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes.buffer], { type: mimeType });
        saveAs(blob, name);
      },
      error: (err) => console.error(err)
    });
  }

  deleteDocumentExpediente(_id: any){
    return this.httpClient.delete(`${UTL_DOCUMENT_EXPEDIENTE}/deleteDocumentExpediente`,{params:{_id}})
  }

//------------------------------ CRM TELEMEDICINA-----------------------------

  getHistoryUserCRM(email_doctor:string, dni_paciente:string, fecha_nacimiento:string,genero:string){
    return this.httpClient.get(`${UTL_DOCUMENT_EXPEDIENTE}/getHistoryUserCRM`,{params:{email_doctor,dni_paciente,fecha_nacimiento,genero}})
  }

  
  pdfOrderCRM(numero_orden:string, hash_orden:string,email_doctor:string){
    return this.httpClient.get(`${UTL_DOCUMENT_EXPEDIENTE}/pdfOrderCRM`,{params:{numero_orden,hash_orden,email_doctor}})
  }
}
