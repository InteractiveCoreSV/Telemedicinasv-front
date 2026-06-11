import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

const BACKEND_URL = environment.urlApi + '/upload';

@Injectable({
  providedIn: 'root',
})
export class UploadIMGService {
  constructor(private httpClient: HttpClient,
    private httpService: HttpService) {}

  getFile(key:string){
    return this.httpClient.get(`${BACKEND_URL}/download`, {params:{key}, responseType:'blob'}).pipe(
      catchError((error) => this.httpService.parseErrorBlob(error,'blob'))
    )
  }

  uploadPhoto(file: File) {
    const formData = new FormData(); // El endpoint de carga espera multipart/form-data
    formData.append('file', file);
    return this.httpClient.post(`${BACKEND_URL}/uploadPhoto`, formData);
  }
  uploadBanner(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${BACKEND_URL}/uploadBanner`, formData);
  }

  uploadBannerProfile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${BACKEND_URL}/uploadBannerProfile`, formData);
  }
}
