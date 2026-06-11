import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { catchError, EMPTY, Observable, of } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';
import { SubsidiaryService } from 'src/app/services/subsidiary.service';

@Injectable({
  providedIn: 'root'
})
export class EditSubsidiaryResolver implements Resolve<any> {

  constructor(private router: Router,private subsidiaryService: SubsidiaryService,private alertsService: AlertsService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    const subsidiary = this.router.getCurrentNavigation()?.extras?.state?.['subsidiary'];


    if(subsidiary){
      return of({subsidiary});
    }

    const idSubsidiary = route.paramMap.get('idSubsidiary');

    if(!idSubsidiary){
      this.router.navigateByUrl('/');
      return EMPTY;
    }

    return this.subsidiaryService.getSubsidiary({_id:idSubsidiary}).pipe(
      catchError(()=>{
        this.router.navigateByUrl('/');
        this.alertsService.toastMixin('Ocurrió error al editar el servicio','error');
        return EMPTY;
      })
    )
  }
}
