import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const baseurlapi = environment.urlApi + '/role';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private httpClient: HttpClient) { }

  getAllRoles(){
    return this.httpClient.get(`${baseurlapi}/allRoles`);
  }
}
