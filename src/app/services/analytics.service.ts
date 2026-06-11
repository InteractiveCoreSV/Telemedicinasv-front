import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const api_url = environment.urlApi + '/analytics'

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCounterAppointmentsByFistGraphic(monthDate:string,filters:any = {}, forYear:any){
    return this.httpClient.get(`${api_url}/getCounterAppointmentsByFistGraphic`,{params:{monthDate,filters:JSON.stringify(filters), forYear}});
  }

  getCounterUser(monthDate:string,filters:any = {}){
    return this.httpClient.get(`${api_url}/getCounterUser`,{params:{monthDate,filters:JSON.stringify(filters)}});
  }

  getPatientRetentionRate(yearDate:string,filters:any = {}){
    return this.httpClient.get(`${api_url}/getPatientRetentionRate`,{params:{yearDate,filters:JSON.stringify(filters)}});
  }

  getTotalSaleForTypeAppointment(yearDate:string,filters:any = {}){
    return this.httpClient.get(`${api_url}/getTotalSaleForTypeAppointment`,{params:{yearDate,filters:JSON.stringify(filters)}});
  }

  getCanceledAppointment(yearDate:string,filters:any = {}){
    return this.httpClient.get(`${api_url}/getCanceledAppointment`,{params:{yearDate,filters:JSON.stringify(filters)}});
  }

  getTimeAppointment(filters:any = {}){
    return this.httpClient.get(`${api_url}/getTimeAppointment`,{params:{filters:JSON.stringify(filters)}});
  }

  getDailyAppointmentReport(day:string,filters:any = {}){
    return this.httpClient.get(`${api_url}/getDailyAppointmentReport`,{params:{day,filters:JSON.stringify(filters)}});
  }

  getCounterAppointmentsByFistGraphicbyday(monthDate:string,filters:any = {}, forYear:any){
    return this.httpClient.get(`${api_url}/getCounterAppointmentsByFistGraphicbyday`,{params:{monthDate,filters:JSON.stringify(filters), forYear}});
  }

  getCounterAppointmentsByHourForDayMonth(monthDate:string,filters:any = {}){
    return this.httpClient.get(`${api_url}/getCounterAppointmentsByHourForDayMonth`,{params:{monthDate,filters:JSON.stringify(filters)}});
  }

  getCounterAppointmentsByHourForDayMonthV2(filters:any = {}){
    return this.httpClient.get(`${api_url}/getCounterAppointmentsByHourForDayMonthV2`,{params:{filters:JSON.stringify(filters)}});
  }

  getStatisticsByStatus(monthDate:string,filters:any = {},forYear:boolean){
    return this.httpClient.get(`${api_url}/getStatisticsByStatus`,{params:{monthDate,forYear,filters:JSON.stringify(filters)}});
  }

  getAppointmentsBySubsidiary(filters:any = {}){
    return this.httpClient.get(`${api_url}/getAppointmentsBySubsidiary`, {params:{filters:JSON.stringify(filters)}})
  }

  getappointentsForMedico(filters:any = {}){
    return this.httpClient.get(`${api_url}/getappointentsForMedico`, {params:{filters:JSON.stringify(filters)}})
  }


  getServicesByAppointments(filters:any = {}){
    return this.httpClient.get(`${api_url}/getServicesByAppointments`, {params:{filters:JSON.stringify(filters)}})
  }

  getEquipoByAppointments(filters:any = {}){
    return this.httpClient.get(`${api_url}/getEquipoByAppointments`, {params:{user: filters.user}})
  }

  getAppointmentsCanceledBySubsidiay(filters:any = {}){
    return this.httpClient.get(`${api_url}/getAppointmentsCanceledBySubsidiay`, {params:{filters:JSON.stringify(filters)}})
  }

  //REPORTES
  getDailyReportBySubsidiary(filters:any = {}){
    return this.httpClient.get(`${api_url}/getDailyReportBySubsidiary`, {params:{filters:JSON.stringify(filters)}})
  }

  getReportProcessMedico(filters:any = {}){
    return this.httpClient.get(`${api_url}/getReportProcessMedico`, {params:{filters:JSON.stringify(filters)}})
  }

  getReportFavoriteMedico(filters:any = {}){
    return this.httpClient.get(`${api_url}/getReportFavoriteMedico`, {params:{filters:JSON.stringify(filters)}})
  }

  getReportMedicoByRating(filters:any = {}){
    return this.httpClient.get(`${api_url}/getReportMedicoByRating`, {params:{filters:JSON.stringify(filters)}})
  }

  getReportPatientsInFollowUp(filters:any = {}){
    return this.httpClient.get(`${api_url}/getReportPatientsInFollowUp`, {params:{filters:JSON.stringify(filters)}})
  }

  getReportPatientsByMedico(filters:any = {}){
    return this.httpClient.get(`${api_url}/getReportPatientsByMedico`, {params:{filters:JSON.stringify(filters)}})
  }

  getReportMotivoCancelacionAppointment(filters:any = {}){
    return this.httpClient.get(`${api_url}/getReportMotivoCancelacionAppointment`, {params:{filters:JSON.stringify(filters)}})
  }

  getSurveys(filters:any = {}){
    return this.httpClient.get(`${api_url}/getSurveys`, {params:{filters:JSON.stringify(filters)}})
  }
}
