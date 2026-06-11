import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SurveyI } from '../interfaces/survey.interface';

const url_api = environment.urlApi + '/survey';

@Injectable({
  providedIn: 'root'
})
export class SurveysService {

  constructor(
    private httpClient: HttpClient
  ) { }

  //CONFIGURACION DE ENCUESTA
  getSurvey(){
    return this.httpClient.get(`${url_api}/getSurvey`)
  }

  getSurveyForPatient(){
    return this.httpClient.get(`${url_api}/getSurveyForPatient`)
  }

  saveSurvey(survey:SurveyI){
    return this.httpClient.post(`${url_api}/saveSurvey`,survey);
  }

  uploadBanner(file: File,surveryId:string) {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${url_api}/uploadBanner`, formData,{params:{surveryId}});
  }

  validationAppointmentSurvey(appointmentId:any){
    return this.httpClient.get(`${url_api}/validationAppointmentSurvey`,{params:{appointmentId}});
  }

  //ENCUESTA CONTESTADA
  completeSurvey(data:any){
    return this.httpClient.post(`${url_api}/completeSurvey`,data);
  }

  getAnsweredSurvey(page:number,filters:any={}){
    return this.httpClient.get(`${url_api}/getAnsweredSurvey`,{params:{page,filters:JSON.stringify(filters)}})
  }

}
