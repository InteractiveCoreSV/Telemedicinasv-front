// import { SplashScreenModule } from './../components/splash-screen/splash-screen.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';
import { DirectivesModule } from '../directives/directives.module';
import { RegisterInfoComponent } from './modals/register-info/register-info.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ResendVerificationEmailComponent } from './resend-verification-email/resend-verification-email.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskDirective } from 'ngx-mask';
import { ComponentsModule } from '../components/components.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterSolicitudMedicoComponent } from './register-solicitud-medico/register-solicitud-medico.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    RecoveryPasswordComponent,
    RegisterInfoComponent,
    ChangePasswordComponent,
    ConfirmEmailComponent,
    ResendVerificationEmailComponent,
    RegisterSolicitudMedicoComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    DirectivesModule,
    FormsModule,
    SharedModule,
    NgxMaskDirective,
    ComponentsModule,
    NgbModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class AuthModule { }
