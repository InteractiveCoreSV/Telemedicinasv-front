import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FichaMedicaGuard implements CanActivate {
  constructor(private router: Router){}

  canActivate(): boolean {
    const state:any = this.router.getCurrentNavigation()?.extras.state;

    if(state?.fichaMedica){
      return true;
    }else{
      this.router.navigateByUrl('/dashboard/ficha-medica');
      return false;
    }
  }

}
