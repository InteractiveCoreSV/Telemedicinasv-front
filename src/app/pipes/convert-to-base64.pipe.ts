import { Pipe, PipeTransform } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'convertToBase64'
})
export class ConvertToBase64Pipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer){}

  transform(file:File): Promise<any> {
    return this.toBase64(file);
  }

  private toBase64(file:File){
    return new Promise((resolve,reject)=>{
      if(file){
        const reader = new FileReader();

        reader.onload = ()=>resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      }else{
        resolve('')
      }
    })
  }

}
