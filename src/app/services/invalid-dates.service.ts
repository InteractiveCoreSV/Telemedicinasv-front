import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const url_api = environment.urlApi + '/invaliddates'

@Injectable({
  providedIn: 'root'
})
export class InvalidDatesService {

  constructor(
    private httpClient: HttpClient
  ) { }

  // TODO: POST METHODS
  newInvalidDate(data:any){
    return this.httpClient.post(`${url_api}/newInvalidDate`,data);
  }

  // TODO: GET ROUTES
  getAllInvalidDates(page:number,filters:any={}){
    return this.httpClient.get(`${url_api}/getAllInvalidDates`,{params:{page,filters:JSON.stringify(filters)}});
  }

  getAllDatesByMonth(month:any,medico:string,subsidiary:string){
    return this.httpClient.get(`${url_api}/getAllDatesByMonth`,{params:{month,medico,subsidiary}});
  }

  // TODO: DELETE METHODS
  deleteInvalidDate(idInvalidDate:string){
    return this.httpClient.delete(`${url_api}/deleteInvalidDate`,{params:{idInvalidDate}})
  }
}
