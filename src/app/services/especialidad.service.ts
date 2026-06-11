import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EspecialidadI } from '../interfaces/especialidad.interface';

const url_api = environment.urlApi + '/especialidad';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  constructor(
    private httpClient: HttpClient
  ) { }

  // TODO: POST METHODS
  newEspecialidad(data:any){
    return this.httpClient.post(`${url_api}/newEspecialidad`,data);
  }

  // TODO: GET ROUTES
  getEspecialidades(page:number,filters:any={}){
    return this.httpClient.get(`${url_api}/getEspecialidades`,{params:{page,filters:JSON.stringify(filters)}})
  }

  getEspecialidad(filters:any={}){
    return this.httpClient.get(`${url_api}/getEspecialidad`,{params:{filters:JSON.stringify(filters)}})
  }

  // TODO: PUT ROUTES
  editEspecialidad(data:any){
    return this.httpClient.put(`${url_api}/editEspecialidad`,data);
  }

  // TODO: DELETE ROUTES
  changeStatus(_id:any){
    return this.httpClient.put(`${url_api}/changeStatus`,{},{params:{_id}})
  }

  deleteEspecialidad(idEspecialidad:string){
    return this.httpClient.delete(`${url_api}/deleteEspecialidad`,{params:{idEspecialidad}});
  }
}
