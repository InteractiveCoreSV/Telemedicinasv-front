import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { Hours2I } from '../interfaces/hours.interface';

const url_api = environment.urlApi +'/hours'

interface HoursResServerI{
  hoursMorning:Hours2I[];
  hoursAfternoon:Hours2I[];
  hoursMorningSaturday:Hours2I[];
  hoursAfternoonSaturday:Hours2I[];
  hoursMorningSunday:Hours2I[];
  hoursAfternoonSunday:Hours2I[];
}

@Injectable({
  providedIn: 'root'
})
export class HoursService {

  hoursResServer$:BehaviorSubject<HoursResServerI | null> = new BehaviorSubject<HoursResServerI | null>(null);

  constructor(
    private httpClient: HttpClient
  ) { }

  // TODO: GET METHODS
  getHours(idHorario:string){
    return this.httpClient.get(`${url_api}/getHours`,{params:{idHorario}})
  }

  getAllHours(all:boolean = false){
    return this.httpClient.get(`${url_api}/getAllHours`,{params:{all: JSON.stringify(all)}})
  }

  getHoursByDoctor(idDoctor:string){
    return this.httpClient.get(`${url_api}/getHoursByDoctor`,{params:{idDoctor}})
  }

  getDatesAvailable(month:any,medico:string){
    return this.httpClient.get(`${url_api}/getDatesAvailable`,{params:{month,medico}});
  }

  getHoursUnavailable(dateSelected:string,medico:string,extraordinaria?:boolean,user?:any){
    extraordinaria = extraordinaria ? extraordinaria : false
    return this.httpClient.get(`${url_api}/getHoursUnavailable`,{params:{dateSelected,medico,extraordinaria:JSON.stringify(extraordinaria),user}});
  }

  getHourUnavailable(date:any,medico:string,hour:any){
    return this.httpClient.get(`${url_api}/getHourUnavailable`,{params:{date,medico,hour}});
  }

  getHoursByMedicoSplited(idMedico:string){
    return this.httpClient.get(`${url_api}/getHoursByMedicoSplited`,{params:{idMedico}})
  }

  getHoursByMedico(idMedico:string){
    return this.httpClient.get(`${url_api}/getHoursByMedico`,{params:{idMedico}})
  }

  getHoursAlmuerzo(idMedico:any){
    return this.httpClient.get(`${url_api}/getHoursAlmuerzo`,{params:{idMedico}})
  }


  // getHoursForEspecialDates(){
  //   return this.httpClient.get(`${url_api}/getHoursForEspecialDates`)
  // }

  //HOURS FOR Horarios
  saveHorarioForDoctor(data:any){
    return this.httpClient.post(`${url_api}/saveHorarioForDoctor`,data);
  }

  // editHorario(data:any){
  //   return this.httpClient.put(`${url_api}/editHorario`,data);
  // }
  
  // getHorarios(especialHorario:boolean, medico?:any){
  //   return this.httpClient.get(`${url_api}/getHorarios`,{params:{especialHorario,medico}})
  // }
  
  // deleteHorario(idHorario:string){
  //   return this.httpClient.delete(`${url_api}/deleteHorario`,{params:{idHorario}});
  // }


  //----
  newHourAlmuerzo(data:any){
    return this.httpClient.post(`${url_api}/newHourAlmuerzo`,data);
  }

  deleteFIsioHoraAlmuerzo(data:any){
    return this.httpClient.post(`${url_api}/deleteFIsioHoraAlmuerzo`,data);
  }
}
