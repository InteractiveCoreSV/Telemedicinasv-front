import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

const url_api = environment.urlApi + '/solicitud-medico';

@Injectable({
  providedIn: 'root'
})
export class SolicitudMedicoService {

  constructor(
    private httpClient: HttpClient
  ) { }

  // TODO: POST METHODS
  newSolicitudMedico(data:any){
    return this.httpClient.post(`${url_api}/newSolicitudMedico`,data);
  }

  // TODO: GET ROUTES
  getSolicitudMedicos(page:number,filters:any={}){
    return this.httpClient.get(`${url_api}/getSolicitudMedicos`,{params:{page,filters:JSON.stringify(filters)}})
  }

  getSolicitudMedico(filters:any={}){
    return this.httpClient.get(`${url_api}/getSolicitudMedico`,{params:{filters:JSON.stringify(filters)}})
  }

  // TODO: PUT ROUTES
  editSolicitudMedico(data:any){
    return this.httpClient.put(`${url_api}/editSolicitudMedico`,data);
  }

  changeStatus(solicitudId:any,status:string){
    return this.httpClient.put(`${url_api}/changeStatus`,{},{params:{solicitudId,status}})
  }

  // TODO: DELETE ROUTES
  deleteSolicitudMedico(_id:string){
    return this.httpClient.delete(`${url_api}/deleteSolicitudMedico`,{params:{_id}});
  }
}
