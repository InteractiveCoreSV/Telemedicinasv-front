import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }

  parseErrorBlob(err: HttpErrorResponse,responseType:string): Observable<any> {
    if(responseType=='blob'){
      const reader: FileReader = new FileReader();

      const obs = new Observable((observer: any) => {
        reader.onloadend = (e) => {
          observer.error(JSON.parse(`${reader.result}`));
          observer.complete();
        }
      });
      reader.readAsText(err.error);
      return obs;
    }

    return of(err);
}

}
