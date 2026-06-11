import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ResendVerificationEmailComponent } from './resend-verification-email/resend-verification-email.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { RegisterSolicitudMedicoComponent } from './register-solicitud-medico/register-solicitud-medico.component';



const routes: Routes = [
  {
    path:'',
    component:AuthComponent,
    children:[
      {
        path:'',
        component:LoginComponent
      },
      {
        path:'register',
        component:RegisterComponent
      },
      {
        path:'recovery-password',
        component:RecoveryPasswordComponent
      },
      {
        path:'change-password',
        component:ChangePasswordComponent
      },
      {
        path:'verify-email',
        component:ConfirmEmailComponent
      },
      {
        path:'resend-verification-email',
        component:ResendVerificationEmailComponent
      },
      {
        path:'nueva-solicitud-medico',
        component:RegisterSolicitudMedicoComponent
      },
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
