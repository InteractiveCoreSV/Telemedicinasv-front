import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CategoryServiceI } from '../interfaces/service.interface';

const url_api_category = environment.urlApi + '/service-category';
const url_api_subcategory = environment.urlApi + '/service-sub-category';
const url_api = environment.urlApi + '/service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  categoryServicengSelect$:BehaviorSubject<CategoryServiceI[]> = new BehaviorSubject<CategoryServiceI[]>([]);

  constructor(
    private httpClient: HttpClient
  ) { }

  // category
  newCategoryService(data:any){
    return this.httpClient.post(`${url_api_category}/registerServiceCategory`,data);
  }

  getCategoriesServices(page:number,filters:any={}){
    return this.httpClient.get(`${url_api_category}/getServiceCategories`,{params:{page,filters:JSON.stringify(filters)}})
  }

  getCategoryService(filters:any={}){
    return this.httpClient.get(`${url_api_category}/getCategoryService`,{params:{filters:JSON.stringify(filters)}})
  }

  changeCategoryStatus(_id:any){
    return this.httpClient.put(`${url_api_category}/changeStatus`,{},{params:{_id}})
  }
  
  editCategoryService(data:any){
    return this.httpClient.put(`${url_api_category}/editCategoryService`,data);
  }
 
  deleteCategoryService(_id:string){
    return this.httpClient.delete(`${url_api_category}/deleteCategoryService`,{params:{_id}});
  }

  uploadImg(img:FormData,_id:string){
    return this.httpClient.put(`${url_api_category}/uploadPhoto`,img,{params:{_id}})
  }

  // SUB CATEGORIES
  newSubCategoryService(data:any){
    return this.httpClient.post(`${url_api_subcategory}/registerServiceSubCategory`,data);
  }

  getSubCategoriesServices(page:number,filters:any={}){
    return this.httpClient.get(`${url_api_subcategory}/getServiceSubCategories`,{params:{page,filters:JSON.stringify(filters)}})
  }

  getSubCategoryService(filters:any={}){
    return this.httpClient.get(`${url_api_subcategory}/getSubCategoryService`,{params:{filters:JSON.stringify(filters)}})
  }

  getServicesForNewAppointmentBySubCategory(category:string[]){
    return this.httpClient.get(`${url_api_subcategory}/getServicesForNewAppointmentBySubCategory`,{params:{category}})
  }

  changeSubCategoryStatus(_id:any){
    return this.httpClient.put(`${url_api_subcategory}/changeStatus`,{},{params:{_id}})
  }
  
  editSubCategoryService(data:any){
    return this.httpClient.put(`${url_api_subcategory}/editSubCategoryService`,data);
  }
  
  deleteSubCategoryService(_id:string){
    return this.httpClient.delete(`${url_api_subcategory}/deleteSubCategoryService`,{params:{_id}});
  }

  // SERVICE
  newService(data:any){
    return this.httpClient.post(`${url_api}/newService`,data);
  }

  getServices(page:number,filters:any={}){
    return this.httpClient.get(`${url_api}/getServices`,{params:{page,filters:JSON.stringify(filters)}})
  }

  getService(filters:any={}){
    return this.httpClient.get(`${url_api}/getService`,{params:{filters:JSON.stringify(filters)}})
  }

  getOtherService(category:string[]){
    return this.httpClient.get(`${url_api}/getOtherService`,{params:{category}})
  }

  changeStatus(_id:any){
    return this.httpClient.put(`${url_api}/changeStatus`,{},{params:{_id}})
  }
  
  editService(data:any){
    return this.httpClient.put(`${url_api}/editService`,data);
  }
  
  deleteService(_id:string){
    return this.httpClient.delete(`${url_api}/deleteService`,{params:{_id}});
  }
}
