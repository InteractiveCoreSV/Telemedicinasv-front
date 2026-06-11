import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const url_api = environment.urlApi + '/transactions';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllTrans(page:number,filters:any = {}){
    return this.httpClient.get(`${url_api}/getAllTrans`,{params:{filters:JSON.stringify(filters),page}})
  }
}
