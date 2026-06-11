import { environment } from './../../environments/environment';

import { ApplicationRef, ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, } from 'rxjs';
import {finalize, tap,filter} from 'rxjs/operators'
import { NgxRolesService } from 'ngx-permissions';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router,ActivatedRoute,Event, RouterEvent } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

// interfaces

// services
import { AlertsService } from '../services/alerts.service';
import { UserI } from '../interfaces/user.interface';
import { WebSocketService } from '../services/web-socket.service';

const baseurlapi = environment.urlApi + '/user';
declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlActually:any
  userInfo:BehaviorSubject<UserI | null> = new BehaviorSubject<UserI | null>(null);

  userClientIp$:BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private httpClient: HttpClient,
    private ngxRolesService: NgxRolesService,
    private jwtHelperService: JwtHelperService,
    private router: Router,
    private ngxSpinnerService: NgxSpinnerService,
    private alertsService: AlertsService,
    private webSocketService: WebSocketService,
  ) {

  }

  recovery(email:string){
    return this.httpClient.post(`${baseurlapi}/recovery`,{email});
  }

  changePassword(data:any){
    return this.httpClient.put(`${baseurlapi}/changePassword`,data)
  }

  async logIn(emailOrUserName:string,password:string){
    await this.ngxSpinnerService.show('generalSpinner');
    this.httpClient.post(`${baseurlapi}/signin`,{emailOrUserName,password}).pipe(
      tap((res:any)=>{
        localStorage.setItem('x-access-token', res['token']);
      }),
      finalize(async()=>{
        await this.ngxSpinnerService.hide('generalSpinner');
      })
    ).subscribe({
      next:(res:any)=>{
        this.setRoles(res.token);

        // if(this.userInfo.value?.roles[0].name === 'sac') {
          this.router.navigateByUrl('/dashboard/home');
        // }else {
          // this.router.navigateByUrl('/dashboard');
        // }
        
        this.alertsService.toastMixin('Has iniciado sesión correctamente','success',2500);
      },
      error:(e)=>{
        const message = e['error']['message'];
        console.log(e)
        this.alertsService.toastMixin(message?message:'Ocurrió un error','error',8000);
      }
    });
  }

  async register(data:any){

    await this.ngxSpinnerService.show('generalSpinner');

    this.httpClient.post(`${baseurlapi}/register`,data).pipe(
      tap((res:any)=>{
        localStorage.setItem('x-access-token', res['token']);
      }),
      finalize(async()=>{
        await this.ngxSpinnerService.hide('generalSpinner');
      })
    ).subscribe({
      next:(res:any)=>{
        this.alertsService.toastMixin('Tu registro se completó con éxito. Revisa tu correo electrónico para validar tu cuenta y acceder a la plataforma.','success',10000);
        this.router.navigateByUrl('/auth');
        return true
      },
      error:(e)=>{
        if (e?.error?.errors && Object.keys(e.error.errors).length > 0) {
            const firstErrorKey = Object.keys(e.error.errors)[0];
            const msg = e.error.errors[firstErrorKey]?.msg || 'Ocurrió un error';
            this.alertsService.toastMixin(msg, 'error');
          } else if (e?.error?.message) {
            this.alertsService.toastMixin(e.error.message, 'error');
          } else {
            this.alertsService.toastMixin('Ocurrió un error inesperado', 'error');
          }  
      }
    });
  }

  registerUserModal(data:any, habilitacionAutomatica:boolean){
    data.habilitacionAutomatica = habilitacionAutomatica
    return this.httpClient.post(`${baseurlapi}/register`, data)
  }

  confirmEmail(token:any){
    return this.httpClient.put(`${baseurlapi}/confirmEmail`,{},{params:{token}});
  }

  resendValidationAccountCode(email:string){
    return this.httpClient.post(`${baseurlapi}/resendValidationAccountCode`,{email});
  }


  async load() {
    const token:any = localStorage.getItem('x-access-token');
    this.ngxRolesService.flushRoles();
    try {
      const tokenDecode = this.jwtHelperService.decodeToken(token);
      this.userInfo.next({...tokenDecode.user, roles: tokenDecode.role});
      tokenDecode.role.forEach((role:any) => {
        this.ngxRolesService.addRole(role.name, []);
      });

    } catch (e) {
      this.ngxRolesService.addRole('no-auth', []);
      // this.logout();c
    }
  }

  setRoles(token:any) {
    this.ngxRolesService.flushRoles();
    const tokenDecode = this.jwtHelperService.decodeToken(token);
    this.userInfo.next({...tokenDecode.user, roles: tokenDecode.role});

    tokenDecode.role.forEach((role:any) => {
      this.ngxRolesService.addRole(role.name, []);
    });
  }

  getUserInfo(){
    return this.userInfo.asObservable();
  }

  getToken() {
    return localStorage.getItem('x-access-token');
  }

  refreshToken() {
    let token: any
    if(localStorage.getItem('x-access-token')){
      token = localStorage.getItem('x-access-token')
    }
    return this.httpClient.get(`${baseurlapi}/renew`, { headers: { 'x-access-token':  token} })
      .pipe(tap((token:any) => { localStorage.setItem('x-access-token', token['token']) }))
  }


  logout(login?:boolean){
    const user = this.userInfo.getValue()
    this.webSocketService.notifyLogout(user?._id)
    if(this.ngxRolesService.getRole('medico')){
        this.webSocketService.notifyLogout(user?._id)
    }
    // }else {
      this.closeSesion()
    // }

  }

  closeSesion(){
    localStorage.removeItem('x-access-token');
    this.ngxRolesService.flushRoles();
    this.userInfo.next(null);
    this.ngxRolesService.addRole('no-auth',[]);
    this.router.navigateByUrl('/auth',{replaceUrl:true})
  }

  async changeStatusMedico(_id:any,status:string,logout:boolean = false){
    await this.ngxSpinnerService.show('generalSpinner');
    this.httpClient.put(`${baseurlapi}/changeStatusMedico`,{_id,status}).pipe(
      tap((res:any)=>{
        this.updateToke(res['token'])
      }),
      finalize(async()=>{
        await this.ngxSpinnerService.hide('generalSpinner');
      })
    ).subscribe({
      next:(res:any)=>{
        if(logout){
          this.closeSesion()
        }
      },
      error:(e)=>{
        const message = e['error']['message'];
        console.log(e)
        this.alertsService.toastMixin(message?message:'Ocurrió un error','error',8000);
      }
    });
  }

  async changeStatusMedicoReload(_id:any,status:string){
    this.httpClient.put(`${baseurlapi}/changeStatusMedico`,{_id,status}).pipe(
      tap((res:any)=>{
        this.updateToke(res['token'])
      }),

    ).subscribe({
      next:(res:any)=>{

      },
      error:(e)=>{
        const message = e['error']['message'];
        console.log(e)
        this.alertsService.toastMixin(message?message:'Ocurrió un error','error',8000);
      }
    });
  }

  updateToke(token:string){
    localStorage.setItem('x-access-token', token);
    const tokenDecode = this.jwtHelperService.decodeToken(token);
    this.userInfo.next(tokenDecode.user);
  }
}
