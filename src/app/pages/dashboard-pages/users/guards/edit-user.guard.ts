import { Injectable } from '@angular/core';
import { Router,CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EditUserGuard implements CanActivate {
  constructor(private router: Router){}

  canActivate(): any{
    const state:any = this.router.getCurrentNavigation()?.extras.state;
    if(state?.user){
      return true;
    }else{
      this.router.navigateByUrl('/dashboard');
      return false;
    }
  }

}
