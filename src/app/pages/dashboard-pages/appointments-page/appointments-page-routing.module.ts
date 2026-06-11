import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsPageComponent } from './appointments-page.component';
import { AllAppointmentsPageComponent } from './all-appointments-page/all-appointments-page.component';

const routes: Routes = [
  {
    path:'',
    component:AppointmentsPageComponent,
    children:[
      
     
      {
        path:'todas-las-citas',
        data:{
          title:'Historial de citas',
          breadcrumb:{
            title:'Historial',
            url:'/dashboard/citas/todas-las-citas'
          }
        },
        component: AllAppointmentsPageComponent
      },
      {
        path:'',
        pathMatch:'full',
        redirectTo:'/dashboard/calendar'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsPageRoutingModule { }
