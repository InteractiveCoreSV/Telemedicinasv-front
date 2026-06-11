import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InsuranceGuard implements CanActivate {
  constructor(private router: Router){}

  canActivate(): boolean {
    const state:any = this.router.getCurrentNavigation()?.extras.state;

    if(state?.insurance){
      return true;
    }else{
      this.router.navigateByUrl('/dashboard/insurance');
      return false;
    }
  }

}
