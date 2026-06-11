import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

const url_api = environment.urlApi + '/video-conferencia';

@Injectable({
  providedIn: 'root'
})
export class VideoConferenciaService {

  constructor(
    private httpClient: HttpClient
  ) { }

  // TODO: POST METHODS
  newVideoConferencia(data:any){
    return this.httpClient.post(`${url_api}/registerVideoConferencia`,data);
  }

  // TODO: GET ROUTES
  getVideoConferencias(page:number,status:string = 'all'){
    return this.httpClient.get(`${url_api}/getVideoConferencias`,{params:{page,status}})
  }

  getVideoConferencia(filters:any={}){
    return this.httpClient.get(`${url_api}/getVideoConferencia`,{params:{filters:JSON.stringify(filters)}})
  }

  getVideoConferenciasForSelect(){
    return this.httpClient.get(`${url_api}/getVideoConferenciasForSelect`)
  }

  // TODO: PUT ROUTES
  editVideoConferencia(data:any){
    return this.httpClient.put(`${url_api}/editVideoConferencia`,data);
  }

  uploadImg(img:FormData,idVideoConferencia:string){
    return this.httpClient.put(`${url_api}/uploadImg`,img,{params:{idVideoConferencia}})
  }

  changeStatus(_id:any){
    return this.httpClient.put(`${url_api}/changeStatus`,{},{params:{_id}})
  }

  // TODO: DELETE ROUTES
  removeImg(idVideoConferencia:string,keyImg:string){
    return this.httpClient.delete(`${url_api}/removeImg`,{params:{idVideoConferencia,keyImg}});
  }

  deleteVideoConferencia(idVideoConferencia:string){
    return this.httpClient.delete(`${url_api}/deleteVideoConferencia`,{params:{idVideoConferencia}});
  }
}
