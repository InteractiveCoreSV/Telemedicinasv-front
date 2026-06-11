import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SolicitudMedicoGuard implements CanActivate {
  constructor(private router: Router){}

  canActivate(): boolean {
    const state:any = this.router.getCurrentNavigation()?.extras.state;

    if(state?.medico){
      return true;
    }else{
      this.router.navigateByUrl('/dashboard/medicos/solicitudes-medico');
      return false;
    }
  }

}
