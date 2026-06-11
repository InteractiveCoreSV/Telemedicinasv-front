import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppointmentI } from '../interfaces/appointment.interface';
import { BehaviorSubject } from 'rxjs';

const api_url = environment.urlApi + '/appointment'

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  updateAppointmets$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  appointmentRemisionSelected$:BehaviorSubject<AppointmentI> = new BehaviorSubject<AppointmentI>(null as any);

  constructor(
    private httpClient: HttpClient
  ) { }

    // TODO: POST METHODS
    newAppointmentClient(info:any){
      return this.httpClient.post(`${api_url}/newAppointmentClient`,info);
    }

    newAppointmentPaymentCard(info:any){
      return this.httpClient.post(`${api_url}/newAppointmentPaymentCard`,info);
    }

    reprogramarAppointment(info:any){
      info.onlyPhone = `${info.user.countryCode}${info.user.phone}`;
      info.typeAppoinment = info.typeAppoinment._id
      info.meetingTool = info.meetingTool?._id

      return this.httpClient.post(`${api_url}/reprogramarAppointment`,info);
    }

    insertLinkVideoconferencia(data:any){
      return this.httpClient.put(`${api_url}/insertLinkVideoconferencia`,{data});
    }

    payAppointment(info:any){
      return this.httpClient.post(`${api_url}/payAppointment`,info);
    }

  // TODO: GET METHODS
  getAllAppointmentsByMonth(monthDate:string,filters:any = {}){
    return this.httpClient.get(`${api_url}/getAllAppointmentsByMonth`,{params:{monthDate,filters:JSON.stringify(filters)}});
  }

  getAppointments(page:number,filters:any={}){
    return this.httpClient.get(`${api_url}/getAppointments`,{params:{page,filters:JSON.stringify(filters)}})
  }

  getAppointmentById(_id:any){
    return this.httpClient.get(`${api_url}/getAppointmentById`,{params:{_id}})
  }


  getCanceledAppointments(page:number,filters:any={}){
    return this.httpClient.get(`${api_url}/getCanceledAppointments`,{params:{page,filters:JSON.stringify(filters)}})
  }

  getCanceledAppointmentsDetailAll(filters:any={}){
    return this.httpClient.get(`${api_url}/getCanceledAppointmentsDetailAll`,{params:{filters:JSON.stringify(filters)}})
  }

  getCanceledAppointmentsDetail(page:number,filters:any={}){
    return this.httpClient.get(`${api_url}/getCanceledAppointmentsDetail`,{params:{page,filters:JSON.stringify(filters)}})
  }

  getAppointmentsByDateAndHour(date:any, hour:any, subsidiary:any){
    return this.httpClient.get(`${api_url}/getAppointmentsByDateAndHour`,{params:{date,hour, subsidiary}})
  }

  getAppointmentsCanceled24H(page:number,monthDate:string,filters:any = {}, forYear:any){
    return this.httpClient.get(`${api_url}/getAppointmentsCanceled24H`,{params:{page,monthDate,filters:JSON.stringify(filters), forYear}});
  }

  getAppointmentsExtraordinarias(page:number,monthDate:string,filters:any = {}, forYear:any, type:string){
    return this.httpClient.get(`${api_url}/getAppointmentsExtraordinarias`,{params:{page,monthDate,filters:JSON.stringify(filters), forYear,type}});
  }

  // TODO: PUT ROUTES
  changeStatus(appointmentId:string,status:string,typeCancel?:string, commentCancel?:string, dateAndHourCancel?:any,motivoCancel?:string){
    return this.httpClient.put(`${api_url}/changeStatus`,{appointmentId,status,typeCancel,commentCancel, dateAndHourCancel,motivoCancel})
  }

  updateAppointment(data:any){
    return this.httpClient.put(`${api_url}/updateAppointment`,{data})
  }


  changeStatusInProgress(appointmentId:string,status:string, timeStatusInProgress:any,medicoId:string | undefined){
    return this.httpClient.put(`${api_url}/changeStatusInProgress`,{appointmentId,status,timeStatusInProgress,medicoId})
  }


  //TODO: PARA LAS ESTADISTICAS
  getCounterAppointmentsByFistGraphic(monthDate:string,filters:any = {}, forYear:any){
    return this.httpClient.get(`${api_url}/getCounterAppointmentsByFistGraphic`,{params:{monthDate,filters:JSON.stringify(filters), forYear}});
  }

  getStatisticsByStatus(){
    return this.httpClient.get(`${api_url}/getStatisticsByStatus`);
  }

  getAppointmentByIdForSurvey(_id:any){
    return this.httpClient.get(`${api_url}/getAppointmentByIdForSurvey`,{params:{_id}})
  }
}
