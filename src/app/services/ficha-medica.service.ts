import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

const URL_FICHA_MEDICA = environment.urlApi+'/ficha-medica';

@Injectable({
  providedIn: 'root'
})
export class FichaMedicaService {

  constructor(
    private httpClient:HttpClient,
  ) { }

  //Customizacion de formulario
  saveFichaMedicaSections(data:any){
    return this.httpClient.post(`${URL_FICHA_MEDICA}/saveFichaMedicaSections`,data);
  }

  getFichaMedicaSections(underAge:any){
    return this.httpClient.get(`${URL_FICHA_MEDICA}/getFichaMedicaSections`,{params:{underAge}})
  }

  getFichaMedicaSectionsEdit(fichamedicaId:string){
    return this.httpClient.get(`${URL_FICHA_MEDICA}/getFichaMedicaSectionsEdit`,{params:{fichamedicaId}})
  }

  getFichasMedicas(){
    return this.httpClient.get(`${URL_FICHA_MEDICA}/getFichasMedicas`)
  }

  // Ficha media llenada
  saveFichaMedica(data:any){
    return this.httpClient.post(`${URL_FICHA_MEDICA}/saveFichaMedica`,data);
  }
  
  getFichaMedicasByPatient(_id:string, page:number,nameDocumment:string){
    return this.httpClient.get(`${URL_FICHA_MEDICA}/getFichaMedicasByPatient`,{params:{_id,page,nameDocumment}})
  }

  generatePDFTratamiento(idFichaMedica:string,tratamientoId:string){
    return this.httpClient.get(`${URL_FICHA_MEDICA}/generatePDFTratamiento`,
      { params:{idFichaMedica,tratamientoId}, responseType: 'blob', observe: 'response' }
    );
  }

  generateEstudioPDF(idFichaMedica:string, estudioId:string){
    return this.httpClient.get(`${URL_FICHA_MEDICA}/generateEstudioPDF`,
      { params:{idFichaMedica, estudioId}, responseType: 'blob', observe: 'response' }
    );
  }

  previewDocumentPDF(body: {category:string, generalInfo:any, firma:any, sello:any, medico:any}){
    return this.httpClient.post(`${URL_FICHA_MEDICA}/previewDocumentPDF`, body,
      { responseType: 'blob', observe: 'response' }
    );
  }

  getSummaryFichaMedicasByPatient(page:number,filters:any){
    return this.httpClient.get(`${URL_FICHA_MEDICA}/getSummaryFichaMedicasByPatient`,{params:{page,filters:JSON.stringify(filters)}})
  }

  deleteFichaMedica(_id: any){
    return this.httpClient.delete(`${URL_FICHA_MEDICA}/deleteFichaMedica`,{params:{_id}})
  }
}

