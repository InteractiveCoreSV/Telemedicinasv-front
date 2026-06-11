import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SubsidiaryI } from '../interfaces/subsidiary.interface';

const url_api = environment.urlApi + '/subsidiary';

@Injectable({
  providedIn: 'root'
})
export class SubsidiaryService {
  subsidiariesngSelect$:BehaviorSubject<SubsidiaryI[]> = new BehaviorSubject<SubsidiaryI[]>([]);

  constructor(
    private httpClient: HttpClient
  ) { }

  // TODO: POST METHODS
  newSubsidiary(data:any){
    const newSubsidiary = new FormData();

    data.photos?.forEach((photo:File) => {
      newSubsidiary.append('photos',photo);
    });

    const {photos,...dataPet} = data;

    newSubsidiary.append('dataSubsidiary',JSON.stringify(dataPet));
    return this.httpClient.post(`${url_api}/newSubsidiary`,newSubsidiary);
  }

  // TODO: GET ROUTES
  getSubsidiaries(page:number,filters:any={}){
    return this.httpClient.get(`${url_api}/getSubsidiaries`,{params:{page,filters:JSON.stringify(filters)}})
  }

  getSubsidiary(filters:any={}){
    return this.httpClient.get(`${url_api}/getSubsidiary`,{params:{filters:JSON.stringify(filters)}})
  }

  // TODO: PUT ROUTES
  editSubsidiary(data:any){
    return this.httpClient.put(`${url_api}/editSubsidiary`,data);
  }

  addPhoto(file:File,idSubsidiary:string){
    const newFormData = new FormData();

    newFormData.append('photo',file);
    return this.httpClient.put(`${url_api}/addPhoto`,newFormData,{params:{idSubsidiary}});
  }

  // TODO: DELETE ROUTES
  removePhoto(idSubsidiary:string,keyPhoto:string){
    return this.httpClient.delete(`${url_api}/removePhoto`,{params:{idSubsidiary,keyPhoto}});
  }

  changeStatus(_id:any){
    return this.httpClient.put(`${url_api}/changeStatus`,{},{params:{_id}})
  }

  deleteSubsidiary(idSubsidiary:string){
    return this.httpClient.delete(`${url_api}/deleteSubsidiary`,{params:{idSubsidiary}});
  }
}
