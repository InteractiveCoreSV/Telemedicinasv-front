import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilesPageComponent } from './profiles-page.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path:'',
    component:ProfilesPageComponent,
    children:[
      {
        path:'mi-cuenta',
        data:{
          title:'Mi Cuenta',
          breadcrumb:
            {
              label:'Perfil',
              url:'/dashboard/perfil/mi-cuenta'
            }
        },
        component:ProfileComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesPageRoutingModule { }
