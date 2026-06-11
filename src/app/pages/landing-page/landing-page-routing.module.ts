import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { ContactanosComponent } from './contactanos/contactanos.component';
import { LandingPageModule } from './landing-page.module';
import { LandingPageComponent } from './landing-page.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    children: [
      {
        path:'',
        component:HomeComponent
      },
        {
      path: '',
      pathMatch: 'full',
      redirectTo: '/',
    },
    ]
  }
  // {
  //   path:'servicios',
  //   component:ServicesComponent
  // },
  // {
  //   path:'contactanos',
  //   component:ContactanosComponent
  // },

  // {
  //   path:'**',
  //   pathMatch:'full',
  //   redirectTo:'/'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule { }
