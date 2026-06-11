import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertsService } from './alerts.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserI } from '../auth/interfaces/user.interface';

const URL_USER = environment.urlApi+'/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private httpClient:HttpClient,
    private alertService: AlertsService,
  ) { }

  createUser(data:UserI, solicitudMedico?:string){
    return this.httpClient.post(`${URL_USER}/createUser`,{...data, solicitudMedico: solicitudMedico ?? null});
  }

  editUser(data:UserI){
    return this.httpClient.put(`${URL_USER}/editUser`,data);
  }

  editUserForCRM(data:UserI){
    return this.httpClient.put(`${URL_USER}/editUserForCRM`,data);
  }


  editMyAccount(data:any){
    return this.httpClient.put(`${URL_USER}/editMyAccount`,data);
  }

  changeStatus(idUser:string){
    return this.httpClient.put(`${URL_USER}/changeStatus`,{},{params:{idUser}});
  }

  updateProfile(data:any){
    return this.httpClient.put(`${URL_USER}/updateProfile`,data);
  }

  
  uploadSello(img:FormData,_id:string){
    return this.httpClient.put(`${URL_USER}/uploadSello`,img,{params:{_id}});
  }

  updatePassword(data:any){
    return this.httpClient.put(`${URL_USER}/updatePassword`,data)
  }

  deleteUser(_id: any){
    return this.httpClient.delete(`${URL_USER}/deleteUser`,{params:{_id}})
  }

  deleteMedico(_id: any){
    return this.httpClient.delete(`${URL_USER}/deleteMedico`,{params:{_id}})
  }

  getloggedUser(){
    return this.httpClient.get(`${URL_USER}/getLoggedUser`);
  }

  getClients(page:number){
    return this.httpClient.get(`${URL_USER}/getClients`,{params:{page}});
  }

  searchUsers(search:string,filters:any,page?:any){
    return this.httpClient.get(`${URL_USER}/searchUsers`,{params:{search,page,filters:JSON.stringify(filters)}});
  }

  getUsers(page:number,filters?:any){
    return this.httpClient.get(`${URL_USER}/getUsers`,{params:{page,filters:filters?JSON.stringify(filters):''}})
  }

  getUserById(_id:string){
    return this.httpClient.get(`${URL_USER}/getUserById`,{params:{_id}})
  }

  getPatientsForExport(filters?:any){
    return this.httpClient.get(`${URL_USER}/getPatientsForExport`,{params:{filters:filters?JSON.stringify(filters):''}})
  }
  
  getPatients(page:number,filters?:any){
    return this.httpClient.get(`${URL_USER}/getPatients`,{params:{page,filters:filters?JSON.stringify(filters):''}})
  }

  getCounterUser(monthDate:string,filters:any = {},status:boolean){
    return this.httpClient.get(`${URL_USER}/getCounterUser`,{params:{monthDate,status,filters:JSON.stringify(filters)}});
  }

  getMedicos(page:number,filters?:any){
    return this.httpClient.get(`${URL_USER}/getMedicos`,{params:{page,filters:filters?JSON.stringify(filters):''}})
  }

  getMedicosForNewAppointment(subsidiary:string,especialidad:string | null){
    return this.httpClient.get(`${URL_USER}/getMedicosForNewAppointment`,{params:{subsidiary,especialidad :especialidad ?? ''}})
  }
  
  //MENORES DE EDAD
  addUnderAgeToProfile(data:any){
    return this.httpClient.put(`${URL_USER}/addUnderAgeToProfile`,data);
  }

  editUnderAgeToProfile(data:any){
    return this.httpClient.put(`${URL_USER}/editUnderAgeToProfile`,data);
  }
  
  getMenoresDeEdad(userId:any){
    return this.httpClient.get(`${URL_USER}/getMenoresDeEdad`,{params:{userId}})
  }

  deleteMenorEdad(_id: any,idMenorEdad:any){
    return this.httpClient.delete(`${URL_USER}/deleteUndeAge`,{params:{_id,idMenorEdad}})
  }
  

  //Favorite medicos
  getFavoriteDoctors(){
    return this.httpClient.get(`${URL_USER}/getFavoriteDoctors`);
  }

  updateFavoriteDoctors(user:string, medicoId:string, isFavorite:boolean){
    return this.httpClient.put(`${URL_USER}/updateFavoriteDoctors`,{user, medicoId, isFavorite});
  }
}
