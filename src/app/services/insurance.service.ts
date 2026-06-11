import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

const url_api = environment.urlApi + '/insurance';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {

  constructor(
    private httpClient: HttpClient
  ) { }

  // TODO: POST METHODS
  newInsurance(data:any){
    return this.httpClient.post(`${url_api}/registerInsurance`,data);
  }


  // TODO: GET ROUTES
  getInsurers(search:string,status:string,page:number){
    return this.httpClient.get(`${url_api}/getInsurers`,{params:{search,status,page}})
  }

  getInsurance(filters:any={}){
    return this.httpClient.get(`${url_api}/getInsurance`,{params:{filters:JSON.stringify(filters)}})
  }

  getInsurersForSelect(){
    return this.httpClient.get(`${url_api}/getInsurersForSelect`)
  }

  // TODO: PUT ROUTES
  editInsurance(data:any){
    return this.httpClient.put(`${url_api}/editInsurance`,data);
  }

  changeStatus(idInsurance:any){
    return this.httpClient.put(`${url_api}/changeStatus`,{},{params:{idInsurance}});
  }


  // TODO: DELETE ROUTE
  deleteInsurance(idInsurance:string){
    return this.httpClient.delete(`${url_api}/deleteInsurance`,{params:{idInsurance}});
  }
}
