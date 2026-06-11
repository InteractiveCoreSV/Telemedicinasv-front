import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, shareReplay, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private refreshTokenInProgress$?: Observable<any>;

  constructor(
    // private alertsService: AlertsService,
     private authService: AuthService) {
     }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isRenewRequest = request.url.includes('/renew');

    if(this.authService.getToken()){
      request = this.setToken(request,this.authService.getToken());
    }
    return next.handle(request).pipe(catchError(error=>{
      if(error instanceof HttpErrorResponse && error.status ===401){
        if (isRenewRequest) {
          this.authService.logout();
          return throwError(() => error);
        }
        return this.handle401Error(request,next);
      }else{
        if(error instanceof HttpErrorResponse && error.status ===400 && error['error']['reLogin']){
          this.authService.logout();
        }
        return throwError(() => error);
      }
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
    if (!this.refreshTokenInProgress$) {
      this.refreshTokenInProgress$ = this.authService.refreshToken().pipe(
        finalize(() => {
          this.refreshTokenInProgress$ = undefined;
        }),
        shareReplay(1)
      );
    }

    return this.refreshTokenInProgress$.pipe(
      switchMap((token: any) => {
        return next.handle(this.setToken(request, token['token']));
      }),
      catchError((error: HttpErrorResponse) => {
        this.authService.logout();
        return throwError(() => error);
      })
    );
  }


  setToken(req:HttpRequest<any>,token:any){
    return req.clone({
      setHeaders:{
        'x-access-token':token
      }
    });
  }
}
