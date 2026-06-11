import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { DatePipe, registerLocaleData } from '@angular/common';
import localEs from '@angular/common/locales/es';
registerLocaleData(localEs);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { ReactiveFormsModule } from '@angular/forms';

import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxPermissionsModule } from 'ngx-permissions';
import { JwtModule } from '@auth0/angular-jwt';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';

import { IConfig, provideEnvironmentNgxMask } from 'ngx-mask'
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

import * as moment from 'moment'
import { AllMedicoSolicitudComponent } from './pages/dashboard-pages/medicos/all-medico-solicitud/all-medico-solicitud.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environments/environment';

const config: SocketIoConfig = { url: environment.urlApiPure, options: {} };

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    SocketIoModule.forRoot(config),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PagesModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({}),
    NgxPermissionsModule.forRoot(),
    FlatpickrModule.forRoot(),
    JwtModule.forRoot({
      config:{
        tokenGetter:()=>{return localStorage.getItem('x-access-token')}
      }
    }),
    FullCalendarModule,
    NgxSpinnerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgSelectModule,
  ],
  providers: [
    provideEnvironmentNgxMask(maskConfig),
    {provide:LOCALE_ID,useValue:'es-US'},
    {provide:HTTP_INTERCEPTORS,useClass:JwtInterceptor,multi:true},
    {provide: DatePipe}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // moment.locale('es'); // Establecer el locale a español
  }
 }
